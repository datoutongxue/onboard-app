<template>
  <van-collapse-item title="基本信息 :" name="1">
    <van-cell-group inset>
      <van-field
        v-model="form.name"
        name="name"
        label="*姓名 :"
        placeholder="请输入姓名"
        :rules="[{ required: true, message: '姓名不能为空' }]"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.pinyin"
        name="pinyin"
        label="*姓名全拼 :"
        placeholder="请输入姓名全拼"
        :rules="[
          { required: true, message: '姓名全拼不能为空' },
          { pattern: /^[a-zA-Z]+$/, message: '姓名全拼只能包含英文字母' },
        ]"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field name="sex" label="*性别 :" :rules="[{ required: true, message: '请选择性别' }]">
        <template #input>
          <van-radio-group v-model="form.sex" direction="horizontal">
            <van-radio name="0">男</van-radio>
            <van-radio name="1">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </van-cell-group>

    <van-cell-group inset>
      <van-field
        v-model="form.mobile"
        name="mobile"
        label="*个人手机 :"
        :rules="[{ required: true, validator: validateMobile, message: '个人手机必填' }]"
        placeholder="请输入个人手机"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.contactTel"
        name="contactTel"
        label="*紧急人联系电话 :"
        :rules="[{ required: true, validator: validateMobile, message: '紧急人联系电话必填' }]"
        placeholder="请输入紧急人联系电话"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.email"
        name="email"
        label="*电子邮箱 :"
        :rules="[{ required: true, validator: validateEmail, message: '电子邮箱必填' }]"
        placeholder="请输入电子邮箱"
      />
    </van-cell-group>

    <van-cell-group inset>
      <van-field
        v-model="form.degreeText"
        name="degree"
        label="*最高学历 :"
        is-link
        readonly
        placeholder="请选择最高学历"
        @click="pickers.showDegree = true"
        :rules="[{ required: true, message: '请选择最高学历' }]"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.school"
        name="school"
        label="*毕业院校 :"
        :rules="[{ required: true, message: '毕业院校必填' }]"
        placeholder="请输入毕业院校"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.profession"
        name="profession"
        label="*专业 :"
        :rules="[{ required: true, message: '专业必填' }]"
        placeholder="请输入专业"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field v-model="form.xlzsbh" name="xlzsbh" label="学历证书编号:" placeholder="请学历证书编号" />
    </van-cell-group>
    <van-cell-group inset>
      <van-field v-model="form.xwzsbh" name="xwzsbh" label="学位证书编号:" placeholder="请学位证书编号" />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.enLevelText"
        name="enLevel"
        label="英语等级 :"
        is-link
        readonly
        placeholder="请选择英语等级"
        @click="pickers.showEn = true"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.jpLevelText"
        name="jpLevel"
        label="日语等级 :"
        is-link
        readonly
        placeholder="请选择日语等级"
        @click="pickers.showJp = true"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.currentAddress"
        name="currentAddress"
        label="*现居地址 :"
        :rules="[{ required: true, message: '现居地址必填' }]"
        placeholder="请输入现居地址(请填写详细至门牌号)"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.familyAddress"
        name="familyAddress"
        label="*家庭地址 :"
        :rules="[{ required: true, message: '家庭地址必填' }]"
        placeholder="请输入家庭地址(请填写详细至门牌号)"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.addressTypeText"
        name="addressType"
        label="本人与公司通讯地址以为准 :"
        placeholder="请选择"
        is-link
        readonly
        @click="pickers.showAddrType = true"
        :rules="[{ required: true, message: '本人与公司通讯地址以为准' }]"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.offerTypeText"
        name="offerType"
        label="*聘用身份 :"
        is-link
        readonly
        placeholder="请选择聘用身份"
        @click="pickers.showOfferType = true"
        :rules="[{ required: true, message: '聘用身份必选' }]"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        name="delivery"
        label="是否返聘"
      >
        <template #input>
          <van-switch size="18px" v-model="form.delivery" />
        </template>
      </van-field>
    </van-cell-group>
    <van-cell-group inset v-show="form.delivery">
      <van-field v-model="form.resignReason" name="resignReason" label="离职原因 :" placeholder="请输入离职原因" />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.marryText"
        name="marry"
        label="*婚姻状况 :"
        is-link
        readonly
        placeholder="请选择婚姻状况"
        @click="pickers.showMarry = true"
        :rules="[{ required: true, message: '婚姻状况必选' }]"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.fertilityText"
        name="fertility"
        label="*生育情况 :"
        is-link
        readonly
        placeholder="请选择生育情况"
        @click="pickers.showFertility = true"
        :rules="[{ required: true, message: '生育情况必选' }]"
      />
    </van-cell-group>
  </van-collapse-item>

  <van-popup v-model:show="pickers.showDegree" position="bottom" safe-area-inset-bottom>
    <van-picker :columns="degrees" @confirm="onDegreeConfirm" @cancel="pickers.showDegree = false" />
  </van-popup>
  <van-popup v-model:show="pickers.showEn" position="bottom" safe-area-inset-bottom>
    <van-picker :columns="enLevels" @confirm="onEnLevelConfirm" @cancel="pickers.showEn = false" />
  </van-popup>
  <van-popup v-model:show="pickers.showJp" position="bottom" safe-area-inset-bottom>
    <van-picker :columns="jpLevels" @confirm="onJpLevelConfirm" @cancel="pickers.showJp = false" />
  </van-popup>
  <van-popup v-model:show="pickers.showAddrType" position="bottom" safe-area-inset-bottom>
    <van-picker :columns="addressTypes" @confirm="onAddressTypeConfirm" @cancel="pickers.showAddrType = false" />
  </van-popup>
  <van-popup v-model:show="pickers.showOfferType" position="bottom" safe-area-inset-bottom>
    <van-picker :columns="offerTypes" @confirm="onOfferTypeConfirm" @cancel="pickers.showOfferType = false" />
  </van-popup>
  <van-popup v-model:show="pickers.showMarry" position="bottom" safe-area-inset-bottom>
    <van-picker :columns="marrys" @confirm="onMarryConfirm" @cancel="pickers.showMarry = false" />
  </van-popup>
  <van-popup v-model:show="pickers.showFertility" position="bottom" safe-area-inset-bottom>
    <van-picker :columns="fertilityes" @confirm="onFertilityConfirm" @cancel="pickers.showFertility = false" />
  </van-popup>
</template>

<script setup lang="ts">
import { useOnboardStore } from '@/stores/onboard'
import { reactive } from 'vue'

const store = useOnboardStore()
const form = store.userInfoForm

const validateMobile = (val: string) => {
  const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
  if (!reg.test(val)) return `手机号码格式不正确'`
  if (form.contactTel && form.mobile && form.contactTel === form.mobile) {
    form.contactTel = ''
    form.mobile = ''
    return '紧急联系人电话和个人手机不能相同'
  }
  return true
}
const validateEmail = (val: string) => {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+/
  if (!reg.test(val)) return `邮箱格式不正确'`
  return true
}

const pickers = reactive({ showDegree: false, showEn: false, showJp: false, showAddrType: false, showOfferType: false, showMarry: false, showFertility: false })
import { ref } from 'vue'
import useDict from '@/hooks/useDict'

const degrees = ref<Array<{ text: string; value: string }>>([])
const enLevels = ref<Array<{ text: string; value: string }>>([])
const jpLevels = ref<Array<{ text: string; value: string }>>([])
const addressTypes = ref<Array<{ text: string; value: string }>>([])
const offerTypes = ref<Array<{ text: string; value: string }>>([])
const marrys = ref<Array<{ text: string; value: string }>>([])
const fertilityes = ref<Array<{ text: string; value: string }>>([])

;(async () => {
  const { items: degreeItems } = useDict('browser.hr_degree')
  const { items: enLevelItems } = useDict('browser.hr_en_level')
  const { items: jpLevelItems } = useDict('browser.hr_jp_level')
  const { items: addrTypeItems } = useDict('browser.hr_address_type')
  const { items: offerTypeItems } = useDict('browser.hr_offer_type')
  const { items: marryItems } = useDict('browser.hr_marry')
  const { items: fertilityItems } = useDict('browser.hr_fertility')
  degrees.value = degreeItems.value
  enLevels.value = enLevelItems.value
  jpLevels.value = jpLevelItems.value
  addressTypes.value = addrTypeItems.value
  offerTypes.value = offerTypeItems.value
  marrys.value = marryItems.value
  fertilityes.value = fertilityItems.value
})()

const onDegreeConfirm = ({ selectedOptions }: any) => { form.degreeText = selectedOptions[0]?.text; form.degree = selectedOptions[0]?.value; pickers.showDegree = false }
const onEnLevelConfirm = ({ selectedOptions }: any) => {
  form.enLevelText = selectedOptions[0]?.text
  form.enLevel = selectedOptions[0]?.value
  pickers.showEn = false
}
const onJpLevelConfirm = ({ selectedOptions }: any) => {
  form.jpLevelText = selectedOptions[0]?.text
  form.jpLevel = selectedOptions[0]?.value
  pickers.showJp = false
}
const onAddressTypeConfirm = ({ selectedOptions }: any) => {
  form.addressTypeText = selectedOptions[0]?.text
  form.addressType = selectedOptions[0]?.value
  pickers.showAddrType = false
}
const onOfferTypeConfirm = ({ selectedOptions }: any) => { form.offerTypeText = selectedOptions[0]?.text; form.offerType = selectedOptions[0]?.value; pickers.showOfferType = false }
const onMarryConfirm = ({ selectedOptions }: any) => { form.marryText = selectedOptions[0]?.text; form.marry = selectedOptions[0]?.value; pickers.showMarry = false }
const onFertilityConfirm = ({ selectedOptions }: any) => { form.fertilityText = selectedOptions[0]?.text; form.fertility = selectedOptions[0]?.value; pickers.showFertility = false }
</script>
