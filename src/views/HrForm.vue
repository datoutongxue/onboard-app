<template>
  <div id="hr-form">
    <PrivacyDialog v-model:show="show" />

    <van-form @submit="ruZhiInfoSubmit" class="form" @failed="onFailed" ref="userInfoFormDom">
      <van-row>
        <van-col span="24">
          <CompanyPicker />
        </van-col>
      </van-row>

      <!-- 仅节选关键块，完整字段在原始 hr.html 中，迁移时保留交互与验证 -->
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
            <van-button size="small" type="primary" native-type="submit" :loading="submitLoading"
              >提交</van-button
            >
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

    <div
      style="
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.6);
      "
      v-if="submitLoading"
    >
      <van-loading
        color="white"
        style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
      />
    </div>

    <!-- 选择器与弹窗：精简保留核心，逻辑一致 -->
    <!-- 选择器已拆到 BankInfo 组件内部 -->
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref, toRefs, computed } from 'vue'
import { showToast, showFailToast, showSuccessToast, showConfirmDialog, showDialog } from 'vant'
import { apiLogin, apiGetDefaultBankInfo, apiSaveUserInfo, apiGetRztzdXm, apiGetRztzdSjh, apiGetRztzdStatus, apiGetCardBin, apiGetRztzdXx, apiGetHistoricalInformation, apiGetBankInfo } from '@/api/onboard'
import { useOnboardStore } from '@/stores/onboard'
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
const isDefaultBank = ref(true)
const show = ref(true)

const state = reactive({
  activeNames: ['1', '2', '3'],
  minDate: new Date(1949, 1, 1),
  maxDate: new Date(2100, 1, 1),
  allPlaces1: [] as any[],
  khhs: [] as any[],
  bankTypes: [
    { text: '建设银行', value: '0' },
    { text: '招商银行', value: '1' },
    { text: '中国银行', value: '2' },
    { text: '工商银行', value: '3' },
  ],
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
    name: '',
    mobile: '',
    email: '',
    showPickerBankType: false,
  },
})

const userInfoFormDom = ref()

onBeforeMount(async () => {
  await getlogin()
  // 历史信息回显（从登录页带入）
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
    // 基本信息回显
    if (val[0] && typeof val[0] === 'object') {
      Object.keys(val[0]).forEach((k) => {
        ;(state.userInfoForm as any)[k] = val[0][k]
      })
      // 触发国家联动，设置证件类型显示与必填
      await onCountryConfirm({ selectedOptions: [{ text: val[0].countryText, value: val[0].country }] })
    }
    // 列表回显（按原逻辑 concat）
    state.userInfoForm.studyData = (state.userInfoForm.studyData || []).concat(val[1] || [])
    state.userInfoForm.workData = (state.userInfoForm.workData || []).concat(val[2] || [])
    state.userInfoForm.familyData = (state.userInfoForm.familyData || []).concat(val[3] || [])
    state.userInfoForm.certData = (state.userInfoForm.certData || []).concat(val[4] || [])
  }
}

const getlogin = async () => {
  const params1 = new URLSearchParams()
  params1.append('loginid', 'pubapisrv')
  params1.append('userpassword', 'pub@p1srv8L')
  try {
    const result = await apiLogin('pubapisrv', 'pub@p1srv8L')
    document.cookie = result.data
    await new Promise((r) => setTimeout(r, 1000))
    await getBankNameByBuCompanyid()
  } catch (e) {
    console.error(e)
  }
}

const onProvinceTypeConfirm = ({ selectedOptions }: any) => {
  if (!selectedOptions) return
  state.userInfoForm.provinceTypeText = selectedOptions.map((o: any) => o.text).join('/')
  const values = selectedOptions.map((o: any) => o.value).join('/')
  state.userInfoForm.provinceType = values.split('/')
  state.userInfoForm.showPickerProvinceType = false
}

const getBankNameByBuCompanyid = async () => {
  const bank = new URLSearchParams()
  bank.append('gsdm', state.userInfoForm.company)
  bank.append('bg', '')
  const { data } = await apiGetDefaultBankInfo(state.userInfoForm.company, state.userInfoForm.bg01)
  const szyh = data?.[0]?.szyh || ''
  if (!szyh) {
    state.userInfoForm.bankType = ''
    state.userInfoForm.bankTypeText = ''
  } else {
    state.userInfoForm.bankType = data[0].id
    state.userInfoForm.bankTypeText = szyh
  }
}

const showPickerBankTypeChange = () => {
  if (!state.userInfoForm.otherBank) return
  state.userInfoForm.showPickerBankType = true
}

const onBankTypeConfirm = ({ selectedOptions }: any) => {
  if (!selectedOptions) return
  state.userInfoForm.bankTypeText = selectedOptions[0]?.text
  state.userInfoForm.bankType = selectedOptions[0]?.value
  state.userInfoForm.showPickerBankType = false
  isDefaultBank.value = false
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
      state.userInfoForm.provinceType[1]
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

const validateMobile = (val: string) => {
  const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
  if (!reg.test(val)) return `手机号码格式不正确'`
}
const validateEmail = (val: string) => {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+/
  if (!reg.test(val)) return `邮箱格式不正确'`
}
const validateBankCard = (val: string) => {
  const reg = /^[0-9]*$/
  if (!reg.test(val)) return `银行卡号格式不正确'`
}
const bankCardConfirmEvt = (val: string) => {
  if (val !== state.userInfoForm.bankCard) return `银行卡比对不正确`
}
const bankCardWaring = () => {
  showToast({ message: '*请确保提供的是所选择银行对应的本人银行卡号' })
}

const computedKhhPicker = computed(() => Number(state.userInfoForm.showPickerKhh) > 0)

// 隐私弹窗的校验与交互已经移入组件

const ruZhiInfoSubmit = async () => {
  await showConfirmDialog({ title: '确认提交', message: '您确定要提交入职信息吗？' })
  if (submitLoading.value) return
  submitLoading.value = true
  try {
    // 必填块校验
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

    // 最高学历与第一条学习经历学历证书一致
    const zgxl1 = state.userInfoForm.degree
    const zgxl2 = state.userInfoForm.studyData?.[0]?.education
    if (zgxl1 && zgxl2 && zgxl1 !== zgxl2) {
      showFailToast({ message: '最高学历与学习经历里第一行的学历证书不匹配，请检查！', position: 'middle' })
      return
    }

    // 姓名/身份证校验
    const ygxm = state.userInfoForm.name
    const rztzdzjh = state.userInfoForm.idNumber
    const pyrsj = state.userInfoForm.mobile

    const { data: xmData } = await apiGetRztzdXm(rztzdzjh, ygxm)
    if (!(xmData && xmData.tag === 'true')) {
      showFailToast({ message: '姓名或者身份证与入职通知单不一致，请联系HR！', position: 'middle' })
      return
    }

    // 手机号与通知单一致
    const { data: sjhData } = await apiGetRztzdSjh(rztzdzjh, pyrsj)
    if (!(sjhData && sjhData.tag === 'true')) {
      showFailToast({ message: '个人手机与入职通知单不一致，请填写正确的手机号或联系HR', position: 'middle' })
      return
    }

    // 身份证号与出生日期一致(中国身份证)
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

    // 通知单状态可提交
    const { data: statusData } = await apiGetRztzdStatus(state.userInfoForm.idNumber)
    if (!(statusData && statusData.tag === 'true')) {
      showFailToast({ message: '证件号码没有有效的入职通知单信息可以关联，请联系HR', position: 'middle' })
      return
    }

    // 武汉公司 + 正式员工必须社保信息校验（按原逻辑占位，具体字段在扩展表单时补齐）
    if (state.userInfoForm.offerType === '0' && state.userInfoForm.company === '1419') {
      if (!state.userInfoForm.bysj || !state.userInfoForm.hkxz2) {
        showFailToast({ message: '武汉公司必须填写社保信息里的户口性质与毕业时间!', position: 'middle' })
        return
      }
    }

    // 银行信息校验
    const otherBank = state.userInfoForm.otherBank
    const bankType2 = state.userInfoForm.bankType2
    const bankType = state.userInfoForm.bankType
    if (otherBank) {
      if (!bankType) {
        showFailToast({ message: '请选择银行类别!', position: 'middle' })
        return
      }
    } else {
      if (bankType2) {
        if (!bankType) {
          showFailToast({ message: '公司无默认银行，请选择其他行!', position: 'middle' })
          return
        }
      } else {
        showFailToast({ message: '公司无默认银行，请选择其他行!', position: 'middle' })
        return
      }
    }

    // 卡号一致
    if (state.userInfoForm.bankCard !== state.userInfoForm.bankCardConfirm) {
      showFailToast({ message: '两次银行卡号不一样，请重新输入', position: 'middle' })
      return
    }

    // 卡bin匹配开户行
    const yhkh6 = String(state.userInfoForm.bankCard || '').substring(0, 6)
    const { data: binInfo } = await apiGetCardBin(yhkh6)
    if (!binInfo || binInfo === 'null' || binInfo === '{}' || !binInfo[0]) {
      showFailToast({ message: '您输入的卡号可能有误', position: 'middle' })
      return
    }
    const banks = binInfo[0]?.bank
    const leng = binInfo[0]?.leng
    const khhmc = otherBank ? (state.userInfoForm.bankTypeText || '') : (bankType2 || '')
    if (banks && khhmc.indexOf(banks) < 0 && banks.indexOf(khhmc) < 0) {
      showFailToast({ message: '您输入的卡号与开户行不匹配', position: 'middle' })
      return
    }
    if (leng && Number(leng) !== String(state.userInfoForm.bankCard || '').length) {
      showFailToast({ message: '您输入的卡号可能有误', position: 'middle' })
      return
    }

    // 一条入职通知单只能提交一次
    const { data: rztzdData } = await apiGetRztzdXx(rztzdzjh)
    if (!(rztzdData && rztzdData.tag === 'true')) {
      showFailToast({ message: '已存在有效入职数据，请勿重复提交信息', position: 'middle' })
      return
    }
    // 证书数组处理（按原逻辑: scfj -> scfjId）
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
    name: '',
    mobile: '',
    email: '',
  })
  showSuccessToast({ message: '重置成功', position: 'middle' })
}

const lookDetail = (index: number) => {
  // 详情弹窗（可按原模板接入）
}
const deleteLearningE = (index: number) => {
  if (state.userInfoForm.studyData.length) {
    state.userInfoForm.studyData.splice(index, 1)
    showFailToast('删除成功')
  }
}

const { userInfoForm, minDate, maxDate, bankTypes, allPlaces1, khhs, activeNames } = toRefs(state)
</script>

<style scoped>
.ml {
  margin-left: 8px;
}
.mt {
  margin-top: 8px;
}
.text_indent {
  text-indent: 2em;
}
</style>
