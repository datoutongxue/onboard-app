<template>
  <van-collapse-item title="证件与个人信息" name="id">
    <van-cell-group inset>
      <van-field
        v-model="form.countryText"
        is-link
        readonly
        name="country"
        label="*国家 :"
        placeholder="请选择国家"
        @click="pickers.showCountry = true"
        :rules="[{ required: true, message: '国家必填' }]"
      />
    </van-cell-group>
    <van-cell-group inset v-show="form.showNation">
      <van-field
        v-model="form.nationText"
        is-link
        readonly
        name="nation"
        label="*民族 :"
        placeholder="请选择民族"
        @click="pickers.showNation = true"
      />
    </van-cell-group>
    <van-cell-group inset v-show="form.showIdType">
      <van-field
        v-model="form.idTypeText"
        is-link
        readonly
        name="idType"
        label="*证件类型 :"
        placeholder="请选择证件类型"
        @click="pickers.showIdType = true"
        :rules="[{ required: true, message: '证件类型必填' }]"
      />
    </van-cell-group>
    <van-cell-group inset v-show="form.showIdType">
      <van-field
        v-model="form.idNumber"
        name="idNumber"
        label="*证件号 :"
        placeholder="请输入证件号"
        :rules="[{ required: true, validator: validateIdNumber, message: '证件号必填' }]"
      />
    </van-cell-group>
    <van-cell-group inset v-show="form.showIdNumberStartDate">
      <van-field
        v-model="form.idNumberStartDate"
        is-link
        readonly
        name="idNumberStartDate"
        label="*身份证有效开始日期 :"
        placeholder="请输入身份证有效开始日期"
        @click="pickers.showIdStart = true"
        :rules="[{ required: form.idNumberStartDateRequired, message: '身份证有效开始日期必填' }]"
      />
    </van-cell-group>
    <van-cell-group inset v-show="form.showIdNumberEndDate">
      <van-field
        v-model="form.idNumberEndDate"
        is-link
        readonly
        name="idNumberEndDate"
        label="*身份证有效结束日期 :"
        placeholder="请输入身份证有效结束日期"
        @click="pickers.showIdEnd = true"
        :rules="[{ required: form.idNumberEndDateRequired, message: '身份证有效结束日期必填' }]"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.birthday"
        is-link
        readonly
        name="birthday"
        label="*出生日期 :"
        placeholder="请选择出生日期"
        @click="pickers.showBirthday = true"
        :rules="[{ required: true, message: '出生日期必填' }]"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.polityText"
        is-link
        readonly
        name="polity"
        label="*政治面貌 :"
        placeholder="请选择政治面貌"
        @click="pickers.showPolity = true"
        :rules="[{ required: true, message: '政治面貌必选' }]"
      />
    </van-cell-group>
  </van-collapse-item>

  <!-- 选择器弹层 -->
  <van-popup v-model:show="pickers.showCountry" position="bottom" safe-area-inset-bottom>
    <van-picker
      :columns="countrys"
      @confirm="onCountryConfirm"
      @cancel="pickers.showCountry = false"
    />
  </van-popup>
  <van-popup v-model:show="pickers.showNation" position="bottom" safe-area-inset-bottom>
    <van-picker
      :columns="nations"
      @confirm="onNationConfirm"
      @cancel="pickers.showNation = false"
    />
  </van-popup>
  <van-popup v-model:show="pickers.showIdType" position="bottom" safe-area-inset-bottom>
    <van-picker
      :columns="idTypes"
      @confirm="onIdTypeConfirm"
      @cancel="pickers.showIdType = false"
    />
  </van-popup>
  <van-popup v-model:show="pickers.showBirthday" position="bottom" safe-area-inset-bottom>
    <van-date-picker
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onDateConfirm('birthday', $event, 'showBirthday')"
      @cancel="pickers.showBirthday = false"
    />
  </van-popup>
  <van-popup v-model:show="pickers.showIdStart" position="bottom" safe-area-inset-bottom>
    <van-date-picker
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onDateConfirm('idNumberStartDate', $event, 'showIdStart')"
      @cancel="pickers.showIdStart = false"
    />
  </van-popup>
  <van-popup v-model:show="pickers.showIdEnd" position="bottom" safe-area-inset-bottom>
    <van-date-picker
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onDateConfirm('idNumberEndDate', $event, 'showIdEnd')"
      @cancel="pickers.showIdEnd = false"
    />
  </van-popup>
  <van-popup v-model:show="pickers.showPolity" position="bottom" safe-area-inset-bottom>
    <van-picker
      :columns="politys"
      @confirm="onPolityConfirm"
      @cancel="pickers.showPolity = false"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import http from '@/api/http'
import { useOnboardStore } from '@/stores/onboard'

const store = useOnboardStore()
const form = store.userInfoForm

const minDate = new Date(1949, 1, 1)
const maxDate = new Date(2100, 1, 1)

const countrys = ref<Array<{ text: string; value: string }>>([])
const nations = ref<Array<{ text: string; value: string }>>([])
const idTypes = ref<Array<{ text: string; value: string }>>([])
const politys = ref<Array<{ text: string; value: string }>>([
  { text: '共产党员', value: '0' },
  { text: '团员', value: '1' },
  { text: '群众', value: '2' },
  { text: '其他', value: '3' },
])

// 初始化国家/民族
;(async () => {
  const { data } = await http.get('/api/OnboardMobile/getInitInfo')
  countrys.value = (data.countrys || []).map((e: any) => ({ text: e.countryname, value: e.id }))
  nations.value = (data.nations || []).map((e: any) => ({ text: e.mzms, value: e.mz }))
})()

const pickers = reactive({
  showCountry: false,
  showNation: false,
  showIdType: false,
  showBirthday: false,
  showIdStart: false,
  showIdEnd: false,
  showPolity: false,
})

function onCountryConfirm({ selectedOptions }: any) {
  form.showIdType = true
  if (selectedOptions) {
    form.countryText = selectedOptions[0]?.text
    form.country = selectedOptions[0]?.value
    pickers.showCountry = false
    form.showNation = ['1', '33', '34', '35'].includes(String(form.country))
    if (form.country == '1') {
      idTypes.value = [{ text: '身份证', value: '01' }]
      form.idTypeText = '身份证'
      form.idType = '01'
      form.showHukou = true
      form.showIdNumberStartDate = true
      form.showIdNumberEndDate = true
      form.idNumberStartDateRequired = true
      form.idNumberEndDateRequired = true
    } else if (['34', '35'].includes(String(form.country))) {
      idTypes.value = [{ text: '港澳通行证', value: 'Z5' }]
      form.idTypeText = '港澳通行证'
      form.idType = 'Z5'
      form.showHukou = false
      form.showIdNumberStartDate = false
      form.showIdNumberEndDate = false
      form.idNumberStartDateRequired = false
      form.idNumberEndDateRequired = false
    } else if (String(form.country) === '33') {
      idTypes.value = [{ text: '公民身份证(台湾)', value: 'Z9' }]
      form.idTypeText = '公民身份证(台湾)'
      form.idType = 'Z9'
      form.showHukou = false
      form.showIdNumberStartDate = false
      form.showIdNumberEndDate = false
      form.idNumberStartDateRequired = false
      form.idNumberEndDateRequired = false
    } else {
      idTypes.value = [{ text: '护照', value: '03' }]
      form.idTypeText = '护照'
      form.idType = '03'
      form.showHukou = false
      form.showIdNumberStartDate = false
      form.showIdNumberEndDate = false
      form.idNumberStartDateRequired = false
      form.idNumberEndDateRequired = false
    }
  }
}

function onNationConfirm({ selectedOptions }: any) {
  if (selectedOptions) {
    form.nationText = selectedOptions[0]?.text
    form.nation = selectedOptions[0]?.value
    pickers.showNation = false
  }
}
function onIdTypeConfirm({ selectedOptions }: any) {
  if (selectedOptions) {
    form.idTypeText = selectedOptions[0]?.text
    form.idType = selectedOptions[0]?.value
    pickers.showIdType = false
  }
}

function onDateConfirm(
  field: 'birthday' | 'idNumberStartDate' | 'idNumberEndDate',
  { selectedValues }: any,
  flagKey: keyof typeof pickers,
) {
  ;(form as any)[field] = selectedValues.join('-')
  ;(pickers as any)[flagKey] = false
}

function onPolityConfirm({ selectedOptions }: any) {
  if (selectedOptions) {
    form.polityText = selectedOptions[0]?.text
    form.polity = selectedOptions[0]?.value
    pickers.showPolity = false
  }
}

function validateIdNumber(val: string) {
  if (form.idTypeText === '身份证') {
    const chinaIDRegex = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (!chinaIDRegex.test(val)) return `身份证格式不正确'`
  } else if (form.idTypeText === '港澳通行证') {
    const hongKongMacauPassRegex = /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/
    if (!hongKongMacauPassRegex.test(val)) return `港澳通行证格式不正确'`
  } else if (form.idTypeText === '公民身份证(台湾)') {
    const taiwanIDRegex = /^[A-Za-z][0-9]{9}$/
    if (!taiwanIDRegex.test(val)) return `台湾身份证格式不正确'`
  } else if (form.idTypeText === '护照') {
    const passportRegex = /^([PpSsGgTt]|[A-IK-Za-iK-z])(\d{7}|[A-Za-z]\d{6}|\d{8})$/
    if (!passportRegex.test(val)) return `护照格式不正确'`
  }
}
</script>
