<template>
  <van-collapse-item title="资质证书（*如有请务必填写）" name="cert">
    <van-cell-group inset>
      <van-button type="primary" size="mini" @click="openAdd">添加资质证书</van-button>
      <van-button class="ml" type="primary" size="mini" @click="deleteAll"
        >删除所有资质证书</van-button
      >
      <van-row class="mt">
        <van-col span="6">获证日期</van-col>
        <van-col span="7">证书名称</van-col>
        <van-col span="6"></van-col>
      </van-row>
      <van-row class="mt" v-for="(item, index) in form.certData" :key="index">
        <van-col span="6">{{ item.startTime }}</van-col>
        <van-col span="7">{{ item.certNameText }}</van-col>
        <van-col class="ml" span="3"><a href="#" @click="viewDetail(index)">详情</a></van-col>
        <van-col span="3"><a href="#" @click="deleteOne(index)">删除</a></van-col>
      </van-row>
      <van-row class="mt" v-show="!form.certData.length">暂无数据</van-row>
    </van-cell-group>
  </van-collapse-item>

  <van-toast v-model:show="detailShow" style="padding: 20px" :duration="5000">
    <template #message>
      <p>
        <span>获证日期 :</span> <span>{{ detail.startTime }}</span>
      </p>
      <p>
        <span>失效日期 :</span> <span>{{ detail.endTime }}</span>
      </p>
      <p>
        <span>证书类别 :</span> <span>{{ detail.certTypeText }}</span>
      </p>
      <p>
        <span>证书名字:</span> <span>{{ detail.certNameText }}</span>
      </p>
      <p>
        <span>备注项:</span> <span>{{ detail.bzx }}</span>
      </p>
    </template>
  </van-toast>

  <van-dialog
    v-model:show="addShow"
    title="添加资质证书"
    :show-cancel-button="false"
    :show-confirm-button="false"
  >
    <van-form @submit="submitAdd">
      <van-cell-group inset>
        <van-field
          v-model="draft.startTime"
          is-link
          readonly
          label="*获证日期:"
          placeholder="请选择证书获证日期"
          @click="pickers.showStart = true"
          :rules="[{ required: true, message: '获证日期必填' }]"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="draft.endTime"
          is-link
          readonly
          label="失效日期:"
          placeholder="请选择证书失效日期"
          @click="pickers.showEnd = true"
          :rules="[{ required: true, message: '证书失效日期必填' }]"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="draft.certTypeText"
          label="*证书分类 :"
          is-link
          readonly
          placeholder="请选择证书分类"
          @click="pickers.showType = true"
          :rules="[{ required: true, message: '请选择证书分类' }]"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="draft.certNameText"
          label="*证书名称 :"
          is-link
          readonly
          placeholder="请选择证书名称"
          @click="pickers.showName = true"
          :rules="[{ required: true, message: '请选择证书名称' }]"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          type="textarea"
          v-model="draft.bzx"
          label="备注项 :"
          placeholder="请输入备注项"
        />
      </van-cell-group>
      <div style="margin: 16px" class="addLearningClass">
        <van-button type="primary" size="mini" native-type="submit">确定</van-button>
        <van-button type="primary" size="mini" class="ml" @click="addShow = false">取消</van-button>
      </div>
    </van-form>
  </van-dialog>

  <van-popup v-model:show="pickers.showStart" position="bottom" safe-area-inset-bottom>
    <van-date-picker
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onDateConfirm('startTime', $event, 'showStart')"
      @cancel="pickers.showStart = false"
    />
  </van-popup>
  <van-popup v-model:show="pickers.showEnd" position="bottom" safe-area-inset-bottom>
    <van-date-picker
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onDateConfirm('endTime', $event, 'showEnd')"
      @cancel="pickers.showEnd = false"
    />
  </van-popup>
  <van-popup v-model:show="pickers.showType" position="bottom" safe-area-inset-bottom>
    <van-picker :columns="certTypes" @confirm="onTypeConfirm" @cancel="pickers.showType = false" />
  </van-popup>
  <van-popup v-model:show="pickers.showName" position="bottom" safe-area-inset-bottom>
    <van-picker :columns="certNames" @confirm="onNameConfirm" @cancel="pickers.showName = false" />
  </van-popup>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import http from '@/api/http'
import { useOnboardStore } from '@/stores/onboard'
import { showFailToast } from 'vant'

const store = useOnboardStore()
const form = store.userInfoForm
const minDate = new Date(1949, 1, 1)
const maxDate = new Date(2100, 1, 1)

const detailShow = ref(false)
const detail = reactive<any>({})
const addShow = ref(false)
const draft = reactive<any>({
  startTime: '',
  endTime: '',
  certType: '',
  certTypeText: '',
  certName: '',
  certNameText: '',
  bzx: '',
})
const pickers = reactive({ showStart: false, showEnd: false, showType: false, showName: false })

const certTypes = ref<Array<{ text: string; value: string }>>([])
const certNames = ref<Array<{ text: string; value: string }>>([])

;(async () => {
  const { data } = await http.get('/api/project/SjzdService/getQualifications', {
    params: { pageSize: 20, current: 1, min: 1, max: 20, companyId: 1 },
  })
  certTypes.value = (data.data || []).map((e: any) => ({ text: e.xs, value: e.z }))
})()

const openAdd = () => {
  Object.assign(draft, {
    startTime: '',
    endTime: '',
    certType: '',
    certTypeText: '',
    certName: '',
    certNameText: '',
    bzx: '',
  })
  addShow.value = true
}
const deleteAll = () => {
  form.certData = []
  showFailToast('删除成功')
}
const deleteOne = (index: number) => {
  if (form.certData.length) {
    form.certData.splice(index, 1)
    showFailToast('删除成功')
  }
}
const viewDetail = (index: number) => {
  Object.assign(detail, form.certData[index])
  detailShow.value = true
}

const onDateConfirm = (
  field: 'startTime' | 'endTime',
  { selectedValues }: any,
  flagKey: keyof typeof pickers,
) => {
  ;(draft as any)[field] = selectedValues.join('-')
  ;(pickers as any)[flagKey] = false
}
const onTypeConfirm = async ({ selectedOptions }: any) => {
  draft.certTypeText = selectedOptions[0]?.text
  draft.certType = selectedOptions[0]?.value
  pickers.showType = false
  // 加载证书名称
  const { data } = await http.get('/api/project/SjzdService/getCertificate', {
    params: { pageSize: 20, current: 1, min: 1, max: 20, companyId: 1, type: 'browser.rz_zsmc' },
  })
  certNames.value = (data.data || []).map((e: any) => ({ text: e.xs, value: e.z }))
}
const onNameConfirm = ({ selectedOptions }: any) => {
  draft.certNameText = selectedOptions[0]?.text
  draft.certName = selectedOptions[0]?.value
  pickers.showName = false
}
const submitAdd = () => {
  form.certData.push({ ...draft })
  addShow.value = false
}
</script>

<style scoped>
.ml {
  margin-left: 8px;
}
.mt {
  margin-top: 8px;
}
</style>
