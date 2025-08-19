<template>
  <div id="hr-form">
    <PrivacyDialog v-model:show="show" />

    <van-form @submit="ruZhiInfoSubmit" class="form" ref="userInfoFormDom">
      <van-row>
        <van-col span="24">
          <CompanyPicker />
        </van-col>
      </van-row>

      <van-row class="rowinfo">
        <van-col span="23" justify="center">
          <van-collapse v-model="activeNames">
            <BasicInfo />
            <IdCardInfo />
            <AddressAndHukou />
            <BankInfo />
            <StudyExperienceList />
            <WorkExperienceList />
            <FamilyList />
            <CertificateList />
            <UploadSection />
          </van-collapse>
        </van-col>
      </van-row>

      <div style="margin-top: 20px">
        <van-row justify="center">
          <van-col span="3">
            <van-button size="small" type="primary" native-type="submit" :loading="submitLoading">提交</van-button>
          </van-col>
          <van-col span="5">
            <van-button size="small" type="primary" @click="savaInfo">保存为草稿</van-button>
          </van-col>
          <van-col span="3" class="ml">
            <van-button size="small" type="primary" @click="reset">重置</van-button>
          </van-col>
        </van-row>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref, toRefs, computed } from 'vue'
import { showToast, showFailToast, showSuccessToast, showConfirmDialog, showDialog } from 'vant'
import { apiLogin, apiGetDefaultBankInfo, apiSaveUserInfo, apiGetRztzdXm, apiGetRztzdSjh, apiGetRztzdStatus, apiGetCardBin, apiGetRztzdXx, apiGetHistoricalInformation, apiGetBankInfo } from '@/api/onboard'
import CompanyPicker from '@/components/hr/CompanyPicker.vue'
import BasicInfo from '@/components/hr/BasicInfo.vue'
import BankInfo from '@/components/hr/BankInfo.vue'
import PrivacyDialog from '@/components/hr/PrivacyDialog.vue'
import IdCardInfo from '@/components/hr/IdCardInfo.vue'
import AddressAndHukou from '@/components/hr/AddressAndHukou.vue'
import WorkExperienceList from '@/components/hr/WorkExperienceList.vue'
import FamilyList from '@/components/hr/FamilyList.vue'
import CertificateList from '@/components/hr/CertificateList.vue'
import StudyExperienceList from '@/components/hr/StudyExperienceList.vue'
import UploadSection from '@/components/hr/UploadSection.vue'

const submitLoading = ref(false)
const show = ref(true)

const state = reactive({
  activeNames: ['1', '2', '3'],
  allPlaces1: [] as any[],
  khhs: [] as any[],
  bankTypes: [] as any[],
  userInfoForm: {
    companyText: '',
    company: '',
    showPickerCompany: false,
    otherBank: false,
    bankTypeText: '',
    bankType: '',
    provinceTypeText: '',
    provinceType: [] as any[],
    showPickerProvinceType: false,
    bankNameText: '',
    bankName: '',
    pickerKhhLoading: false,
    showPickerKhh: false as boolean | number,
    bankCard: '',
    bankCardConfirm: '',
    showLearningexperice: false,
    studyData: [] as any[],
    workData: [] as any[],
    familyData: [] as any[],
    certData: [] as any[],
    name: '',
    mobile: '',
    email: '',
    showPickerBankType: false,
    bg01: '',
    bankType2: '',
    idNumber: '',
    birthday: '',
    idType: '',
    degree: '',
    bysj: '',
    hkxz2: '',
    offerType: '',
    lzzmsmjId: null as any,
    sfzzmsmjhzzyId: null as any,
    sfzfmsmjId: null as any,
  },
})

const userInfoFormDom = ref()

onBeforeMount(async () => {
  await getlogin()
  try {
    const selectedMethod = window.sessionStorage.getItem('selectedMethod') as 'phone' | 'email' | null
    const userInput = window.sessionStorage.getItem('userInput') || ''
    if (selectedMethod && userInput) {
      const { data } = await apiGetHistoricalInformation(selectedMethod, userInput)
      await echoForm(data)
    }
  } catch {}
})

const echoForm = async (val: any) => {
  if (Array.isArray(val)) {
    if (val[0] && typeof val[0] === 'object') {
      Object.keys(val[0]).forEach((k) => {
        ;(state.userInfoForm as any)[k] = val[0][k]
      })
    }
    state.userInfoForm.studyData = (state.userInfoForm.studyData || []).concat(val[1] || [])
    state.userInfoForm.workData = (state.userInfoForm.workData || []).concat(val[2] || [])
    state.userInfoForm.familyData = (state.userInfoForm.familyData || []).concat(val[3] || [])
    state.userInfoForm.certData = (state.userInfoForm.certData || []).concat(val[4] || [])
  }
}

const getlogin = async () => {
  try {
    const result = await apiLogin('pubapisrv', 'pub@p1srv8L')
    document.cookie = result.data
  } catch (e) {}
}

const onProvinceTypeConfirm = ({ selectedOptions }: any) => {
  if (!selectedOptions) return
  state.userInfoForm.provinceTypeText = selectedOptions.map((o: any) => o.text).join('/')
  const values = selectedOptions.map((o: any) => o.value).join('/')
  state.userInfoForm.provinceType = values.split('/')
  state.userInfoForm.showPickerProvinceType = false
}

const chooseKhh = async (val: string) => {
  if (!val) return
  state.userInfoForm.showPickerKhh = true
  state.userInfoForm.pickerKhhLoading = true
  try {
    const { data } = await apiGetBankInfo(
      val,
      state.userInfoForm.bankTypeText || '',
      state.userInfoForm.provinceType[0],
      state.userInfoForm.provinceType[1],
    )
    state.khhs = data.map((d: any) => ({ text: d.label, value: d.value }))
  } finally {
    state.userInfoForm.pickerKhhLoading = false
  }
}

const onKhhConfirm = ({ selectedOptions }: any) => {
  if (!selectedOptions) return
  state.userInfoForm.bankNameText = selectedOptions[0]?.text
  state.userInfoForm.bankName = selectedOptions[0]?.value
  state.userInfoForm.showPickerKhh = -1 as any
}

const closePickerKhh = () => {
  if (state.userInfoForm.showPickerKhh !== -1) state.userInfoForm.bankNameText = ''
  state.userInfoForm.showPickerKhh = false as any
}

const validateBankCard = (val: string) => (/^[0-9]*$/.test(val) ? true : `银行卡号格式不正确'`)
const bankCardConfirmEvt = (val: string) => (val !== state.userInfoForm.bankCard ? `银行卡比对不正确` : true)
const bankCardWaring = () => showToast({ message: '*请确保提供的是所选择银行对应的本人银行卡号' })

const computedKhhPicker = computed(() => Number(state.userInfoForm.showPickerKhh) > 0)

const ruZhiInfoSubmit = async () => {
  await showConfirmDialog({ title: '确认提交', message: '您确定要提交入职信息吗？' })
  if (submitLoading.value) return
  submitLoading.value = true
  try {
    if (state.userInfoForm.studyData.length === 0) {
      showFailToast({ message: '学习经历必填', position: 'middle' })
      return
    }
    if (state.userInfoForm.workData.length === 0) {
      showFailToast({ message: '工作经历必填', position: 'middle' })
      return
    }
    if (state.userInfoForm.familyData.length === 0) {
      showFailToast({ message: '家庭成员必填', position: 'middle' })
      return
    }
    const zgxl1 = state.userInfoForm.degree
    const zgxl2 = state.userInfoForm.studyData?.[0]?.education
    if (zgxl1 && zgxl2 && zgxl1 !== zgxl2) {
      showFailToast({ message: '最高学历与学习经历里第一行的学历证书不匹配，请检查！', position: 'middle' })
      return
    }
    const ygxm = state.userInfoForm.name
    const rztzdzjh = state.userInfoForm.idNumber
    const pyrsj = state.userInfoForm.mobile
    const { data: xmData } = await apiGetRztzdXm(rztzdzjh, ygxm)
    if (!(xmData && xmData.tag === 'true')) {
      showFailToast({ message: '姓名或者身份证与入职通知单不一致，请联系HR！', position: 'middle' })
      return
    }
    const { data: sjhData } = await apiGetRztzdSjh(rztzdzjh, pyrsj)
    if (!(sjhData && sjhData.tag === 'true')) {
      showFailToast({ message: '个人手机与入职通知单不一致，请填写正确的手机号或联系HR', position: 'middle' })
      return
    }
    if (state.userInfoForm.idType === '01') {
      const sfzh = state.userInfoForm.idNumber
      const csrq = state.userInfoForm.birthday
      if (sfzh && csrq) {
        const str1 = sfzh.substring(6, 14)
        const str2 = csrq.replace(/-/g, '')
        if (str1 !== str2) {
          showFailToast({ message: '证件号码或出生日期不对，请检查！', position: 'middle' })
          return
        }
      }
    }
    const { data: statusData } = await apiGetRztzdStatus(state.userInfoForm.idNumber)
    if (!(statusData && statusData.tag === 'true')) {
      showFailToast({ message: '证件号码没有有效的入职通知单信息可以关联，请联系HR', position: 'middle' })
      return
    }
    if (state.userInfoForm.offerType === '0' && state.userInfoForm.company === '1419') {
      if (!state.userInfoForm.bysj || !state.userInfoForm.hkxz2) {
        showFailToast({ message: '武汉公司必须填写社保信息里的户口性质与毕业时间!', position: 'middle' })
        return
      }
    }
    if (state.userInfoForm.bankCard !== state.userInfoForm.bankCardConfirm) {
      showFailToast({ message: '两次银行卡号不一样，请重新输入', position: 'middle' })
      return
    }
    const yhkh6 = String(state.userInfoForm.bankCard || '').substring(0, 6)
    const { data: binInfo } = await apiGetCardBin(yhkh6)
    if (!binInfo || binInfo === 'null' || binInfo === '{}' || !binInfo[0]) {
      showFailToast({ message: '您输入的卡号可能有误', position: 'middle' })
      return
    }
    const banks = binInfo[0]?.bank
    const leng = binInfo[0]?.leng
    const khhmc = state.userInfoForm.bankType2 || state.userInfoForm.bankTypeText || ''
    if (banks && khhmc.indexOf(banks) < 0 && banks.indexOf(khhmc) < 0) {
      showFailToast({ message: '您输入的卡号与开户行不匹配', position: 'middle' })
      return
    }
    if (leng && Number(leng) !== String(state.userInfoForm.bankCard || '').length) {
      showFailToast({ message: '您输入的卡号可能有误', position: 'middle' })
      return
    }
    const certDataArr = state.userInfoForm.certData.map((item: any) => ({ ...item, scfj: item.scfjId }))
    const res = await apiSaveUserInfo({
      ...state.userInfoForm,
      lzzmsmj: state.userInfoForm.lzzmsmjId,
      sfzzmsmjhzzy: state.userInfoForm.sfzzmsmjhzzyId,
      sfzfmsmj: state.userInfoForm.sfzfmsmjId,
      certData: certDataArr,
    })
    if (res.data.code == 1) {
      showDialog({ message: '提交成功!' }).then(() => {
        localStorage.setItem('userInfoForm', JSON.stringify(state.userInfoForm))
      })
    } else {
      showDialog({ message: '写入失败' })
    }
  } finally {
    submitLoading.value = false
  }
}

const savaInfo = () => {
  localStorage.setItem('userInfoForm', JSON.stringify(state.userInfoForm))
  showSuccessToast({ message: '保存成功', position: 'middle' })
}

const reset = () => {
  state.userInfoForm = Object.assign(state.userInfoForm, {
    otherBank: false,
    companyText: '',
    company: '',
    bankTypeText: '',
    bankType: '',
    provinceTypeText: '',
    provinceType: [],
    bankNameText: '',
    bankName: '',
    bankCard: '',
    bankCardConfirm: '',
    studyData: [],
    workData: [],
    familyData: [],
    certData: [],
    name: '',
    mobile: '',
    email: '',
  })
  showSuccessToast({ message: '重置成功', position: 'middle' })
}

const { userInfoForm, bankTypes, allPlaces1, khhs, activeNames } = toRefs(state)
</script>

<style scoped>
.ml { margin-left: 8px; }
.mt { margin-top: 8px; }
.text_indent { text-indent: 2em; }
</style>

