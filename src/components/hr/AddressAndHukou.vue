<template>
  <van-collapse-item title="户口与地址" name="hukou">
    <van-cell-group inset v-if="form.showHukou">
      <van-field
        v-model="form.selectedPlaces1Text"
        is-link
        readonly
        name="selectedPlaces1"
        label="*出生地 :"
        placeholder="请选择出生地"
        @click="pickers.showBirth = true"
        :rules="[{ required: true, message: '请选择出生地' }]"
      />
    </van-cell-group>
    <van-cell-group inset v-if="form.showHukou">
      <van-field
        v-model="form.selectedPlaces2Text"
        name="selectedPlaces2"
        label="*籍贯 :"
        placeholder="请选择籍贯"
        is-link
        readonly
        @click="pickers.showOrigin = true"
        :rules="[{ required: true, message: '请选择籍贯' }]"
      />
    </van-cell-group>
    <van-cell-group inset v-if="form.showHukou">
      <van-field
        v-model="form.selectedPlaces3Text"
        name="selectedPlaces3"
        label="*户口 :"
        placeholder="请选择户口"
        is-link
        readonly
        @click="pickers.showHukou = true"
        :rules="[{ required: true, message: '请选择户口' }]"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        v-model="form.accountTypeText"
        name="accountType"
        label="*户口性质 :"
        placeholder="请选择户口性质"
        @click="pickers.showAccountType = true"
        is-link
        readonly
        :rules="[{ required: true, message: '请选择户口性质' }]"
      />
    </van-cell-group>
  </van-collapse-item>

  <van-popup v-model:show="pickers.showBirth" position="bottom" safe-area-inset-bottom>
    <van-cascader
      title="请选择出生地"
      :options="allPlaces1"
      @close="pickers.showBirth = false"
      @finish="onPlacesConfirm('selectedPlaces1', 'selectedPlaces1Text', 'showBirth', $event)"
    />
  </van-popup>
  <van-popup v-model:show="pickers.showOrigin" position="bottom" safe-area-inset-bottom>
    <van-cascader
      title="请选择籍贯"
      :options="allPlaces1"
      @close="pickers.showOrigin = false"
      @finish="onPlacesConfirm('selectedPlaces2', 'selectedPlaces2Text', 'showOrigin', $event)"
    />
  </van-popup>
  <van-popup v-model:show="pickers.showHukou" position="bottom" safe-area-inset-bottom>
    <van-cascader
      title="请选择户口"
      :options="allPlaces1"
      @close="pickers.showHukou = false"
      @finish="onPlacesConfirm('selectedPlaces3', 'selectedPlaces3Text', 'showHukou', $event)"
    />
  </van-popup>
  <van-popup v-model:show="pickers.showAccountType" position="bottom" safe-area-inset-bottom>
    <van-picker
      :columns="accountTypes"
      @confirm="onAccountTypeConfirm"
      @cancel="pickers.showAccountType = false"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import http from '@/api/http'
import { useOnboardStore } from '@/stores/onboard'

const store = useOnboardStore()
const form = store.userInfoForm
const allPlaces1 = ref<any[]>([])
;(async () => {
  const { data } = await http.get('/api/OnboardMobile/getInitInfo')
  const list = (data.allPlaces || []).map((e: any) => ({
    text: e.label,
    value: e.value,
    children: e.children?.map((c: any) => ({ text: c.label, value: c.value })),
  }))
  allPlaces1.value = list
})()

const accountTypes = [
  { text: '城镇', value: '0' },
  { text: '农村', value: '1' },
]

const pickers = reactive({
  showBirth: false,
  showOrigin: false,
  showHukou: false,
  showAccountType: false,
})

function onPlacesConfirm(
  valueKey: 'selectedPlaces1' | 'selectedPlaces2' | 'selectedPlaces3',
  textKey: 'selectedPlaces1Text' | 'selectedPlaces2Text' | 'selectedPlaces3Text',
  flagKey: keyof typeof pickers,
  { selectedOptions }: any,
) {
  if (!selectedOptions) return
  ;(form as any)[textKey] = selectedOptions.map((o: any) => o.text).join('/')
  const values = selectedOptions.map((o: any) => o.value).join('/')
  ;(form as any)[valueKey] = String(values).split('/')
  ;(pickers as any)[flagKey] = false
}

function onAccountTypeConfirm({ selectedOptions }: any) {
  if (selectedOptions) {
    form.accountTypeText = selectedOptions[0]?.text
    form.accountType = selectedOptions[0]?.value
    pickers.showAccountType = false
  }
}
</script>
