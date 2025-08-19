<template>
  <van-collapse-item title=" 银行信息" name="2">
    <van-cell-group inset>
      <van-field name="otherBank" label="是否它行">
        <template #input>
          <van-switch @change="isOtherBank" size="18px" v-model="form.otherBank" />
        </template>
      </van-field>
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        readonly
        :disabled="!form.otherBank"
        v-model="form.bankTypeText"
        name="bankType"
        label="银行类别 :"
        is-link
        placeholder="请选择银行类别"
        @click="showPickerBankTypeChange"
        :rules="[{ required: true, message: '请选择银行类别' }]"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.provinceTypeText"
        name="provinceType"
        label="*省市 :"
        placeholder="请选择省市"
        is-link
        readonly
        @click="form.showPickerProvinceType = true"
        :rules="[{ required: true, message: '请选择省市' }]"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.bankNameText"
        name="bankName"
        label="*开户行 :"
        @update:model-value="chooseKhh"
        :rules="[{ required: true, message: '开户行必填' }]"
        placeholder="请输入开户行"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.bankCard"
        name="bankCard"
        label="*银行卡号 :"
        @blur="bankCardWaring"
        :rules="[{ required: true, validator: validateBankCard, message: '银行卡号必填' }]"
        placeholder="请输入银行卡号必填"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.bankCardConfirm"
        name="bankCardConfirm"
        label="*卡号确认 :"
        :rules="[{ required: true, validator: bankCardConfirmEvt, message: '银行卡确认必填' }]"
        placeholder="请输入银行卡确认"
      />
    </van-cell-group>
  </van-collapse-item>

  <van-popup v-model:show="form.showPickerProvinceType" position="bottom" safe-area-inset-bottom>
    <van-cascader
      title="请选择所在地区"
      :options="allPlaces1"
      @close="form.showPickerProvinceType = false"
      @finish="onProvinceTypeConfirm"
    />
  </van-popup>
  <van-popup
    v-model:show="computedKhhPicker"
    position="bottom"
    safe-area-inset-bottom
    @close="closePickerKhh"
  >
    <van-picker
      :columns="khhs"
      @confirm="onKhhConfirm"
      @cancel="closePickerKhh"
      :loading="form.pickerKhhLoading"
    />
  </van-popup>
  <van-popup v-model:show="form.showPickerBankType" position="bottom" safe-area-inset-bottom>
    <van-picker
      :columns="bankTypes"
      @confirm="onBankTypeConfirm"
      @cancel="form.showPickerBankType = false"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { computed, reactive, toRefs } from 'vue'
import { useOnboardStore } from '@/stores/onboard'
import http from '@/api/http'
import { showToast } from 'vant'
import { fetchDict } from '@/api/dict'

const store = useOnboardStore()
const form = store.userInfoForm

const state = reactive({
  allPlaces1: [] as Array<{ text: string; value: string; children?: any[] }>,
  khhs: [] as Array<{ text: string; value: string }>,
  bankTypes: [] as Array<{ text: string; value: string }>,
})
const { allPlaces1, khhs, bankTypes } = toRefs(state)
;(async () => {
  bankTypes.value = await fetchDict('browser.hr_bank_type')
})()

const isOtherBank = () => {}
const computedKhhPicker = computed(() => Number(form.showPickerKhh) > 0)

const isDefaultBank = computed(() => !form.otherBank)

const showPickerBankTypeChange = () => {
  if (!form.otherBank) return
  form.showPickerBankType = true
}
const onBankTypeConfirm = ({ selectedOptions }: any) => {
  if (!selectedOptions) return
  form.bankTypeText = selectedOptions[0]?.text
  form.bankType = selectedOptions[0]?.value
  form.showPickerBankType = false
}
const onProvinceTypeConfirm = ({ selectedOptions }: any) => {
  if (!selectedOptions) return
  form.provinceTypeText = selectedOptions.map((o: any) => o.text).join('/')
  const values = selectedOptions.map((o: any) => o.value).join('/')
  form.provinceType = values.split('/')
  form.showPickerProvinceType = false
}
const chooseKhh = async (val: string) => {
  if (!val) return
  form.showPickerKhh = true
  form.pickerKhhLoading = true
  const BankInfo = new URLSearchParams()
  BankInfo.append('bankNmae', val)
  BankInfo.append('bankNameLike', form.bankTypeText)
  BankInfo.append('province', form.provinceType[0])
  BankInfo.append('city', form.provinceType[1])
  try {
    const { data } = await http.post('/api/OnboardMobile/getBankInfo', BankInfo, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    state.khhs = data.map((d: any) => ({ text: d.label, value: d.value }))
  } finally {
    form.pickerKhhLoading = false
  }
}
const onKhhConfirm = ({ selectedOptions }: any) => {
  if (!selectedOptions) return
  form.bankNameText = selectedOptions[0]?.text
  form.bankName = selectedOptions[0]?.value
  form.showPickerKhh = -1 as any
}
const closePickerKhh = () => {
  if (form.showPickerKhh !== -1) form.bankNameText = ''
  form.showPickerKhh = false as any
}

const validateBankCard = (val: string) => (/^[0-9]*$/.test(val) ? true : `银行卡号格式不正确'`)
const bankCardConfirmEvt = (val: string) => (val !== form.bankCard ? `银行卡比对不正确` : true)
const bankCardWaring = () => showToast({ message: '*请确保提供的是所选择银行对应的本人银行卡号' })

// 暴露校验方法给父组件（van-field rules 使用）
defineExpose({
  validateBankCard,
  bankCardConfirmEvt,
  bankCardWaring,
  chooseKhh,
  onBankTypeConfirm,
  onKhhConfirm,
  onProvinceTypeConfirm,
  showPickerBankTypeChange,
})
</script>
