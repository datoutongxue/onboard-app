<template>
  <van-collapse-item title="*工作经历(必填)" name="work">
    <van-cell-group inset>
      <van-field
        v-model="form.firstWork"
        is-link
        readonly
        label="*首次参加工作时间 :"
        placeholder="请选择首次参加工作时间"
        @click="pickers.showFirstWork = true"
        :rules="[{ required: true, message: '首次参加工作时间必填' }]"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-button type="primary" size="mini" @click="openAdd">添加工作经历</van-button>
      <van-button class="ml" type="primary" size="mini" @click="deleteAll"
        >删除所有工作经历</van-button
      >
      <van-row justify="center" class="mt">
        <van-col span="6">开始日期</van-col>
        <van-col span="6">结束日期</van-col>
        <van-col span="6">单位</van-col>
        <van-col span="6"></van-col>
      </van-row>
      <van-row justify="center" class="mt" v-for="(item, index) in form.workData" :key="index">
        <van-col span="6">{{ item.startDate }}</van-col>
        <van-col span="6">{{ item.endDate }}</van-col>
        <van-col span="6">{{ item.company }}</van-col>
        <van-col span="3"><a href="#" @click="viewDetail(index)">详情</a></van-col>
        <van-col span="3"><a href="#" @click="deleteOne(index)">删除</a></van-col>
      </van-row>
      <van-row justify="center" class="mt" v-show="!form.workData.length">暂无数据</van-row>
    </van-cell-group>
  </van-collapse-item>

  <van-toast v-model:show="detailShow" style="padding: 20px" :duration="5000">
    <template #message>
      <p>
        <span>开始日期 :</span> <span>{{ detail.startDate }}</span>
      </p>
      <p>
        <span>结束日期 :</span> <span>{{ detail.endDate }}</span>
      </p>
      <p>
        <span>单位 :</span> <span>{{ detail.company }}</span>
      </p>
      <p>
        <span>职务 :</span> <span>{{ detail.rank }}</span>
      </p>
      <p>
        <span>联系人姓名及电话:</span> <span>{{ detail.tel }}</span>
      </p>
    </template>
  </van-toast>

  <van-dialog
    v-model:show="addShow"
    title="添加工作经历"
    :show-cancel-button="false"
    :show-confirm-button="false"
  >
    <van-form @submit="submitAdd">
      <van-cell-group inset>
        <van-field
          v-model="draft.startDate"
          is-link
          readonly
          label="*开始日期 :"
          placeholder="请选择开始日期"
          @click="pickers.showStart = true"
          :rules="[{ required: true, message: '开始日期必填' }]"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="draft.endDate"
          is-link
          readonly
          label="*结束日期 :"
          placeholder="请选择结束日期"
          @click="pickers.showEnd = true"
          :rules="[{ required: true, message: '结束日期必填' }]"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="draft.company"
          label="*单位 :"
          :rules="[{ required: true, message: '单位' }]"
          placeholder="请输入单位"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="draft.rank"
          label="*职务 :"
          :rules="[{ required: true, message: '职务必填' }]"
          placeholder="请输入职务"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="draft.tel"
          label="*联系人姓名及电话 :"
          :rules="[{ required: true, message: '联系人姓名及电话必填' }]"
          placeholder="请输入联系人姓名及电话"
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
      @confirm="onDateConfirm('startDate', $event, 'showStart')"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="pickers.showStart = false"
    />
  </van-popup>
  <van-popup v-model:show="pickers.showEnd" position="bottom" safe-area-inset-bottom>
    <van-date-picker
      @confirm="onDateConfirm('endDate', $event, 'showEnd')"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="pickers.showEnd = false"
    />
  </van-popup>
  <van-popup v-model:show="pickers.showFirstWork" position="bottom" safe-area-inset-bottom>
    <van-date-picker
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onFirstWorkConfirm"
      @cancel="pickers.showFirstWork = false"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useOnboardStore } from '@/stores/onboard'
import { showFailToast } from 'vant'

const store = useOnboardStore()
const form = store.userInfoForm
const minDate = new Date(1949, 1, 1)
const maxDate = new Date(2100, 1, 1)

const detailShow = ref(false)
const detail = reactive<any>({})
const addShow = ref(false)
const draft = reactive<any>({ startDate: '', endDate: '', company: '', rank: '', tel: '' })
const pickers = reactive({ showStart: false, showEnd: false, showFirstWork: false })

const openAdd = () => {
  Object.assign(draft, { startDate: '', endDate: '', company: '', rank: '', tel: '' })
  addShow.value = true
}
const deleteAll = () => {
  form.workData = []
  showFailToast('删除成功')
}
const deleteOne = (index: number) => {
  if (form.workData.length) {
    form.workData.splice(index, 1)
    showFailToast('删除成功')
  }
}
const viewDetail = (index: number) => {
  Object.assign(detail, form.workData[index])
  detailShow.value = true
}

const onDateConfirm = (
  field: 'startDate' | 'endDate',
  { selectedValues }: any,
  flagKey: keyof typeof pickers,
) => {
  ;(draft as any)[field] = selectedValues.join('-')
  ;(pickers as any)[flagKey] = false
}
const onFirstWorkConfirm = ({ selectedValues }: any) => {
  form.firstWork = selectedValues.join('-')
  pickers.showFirstWork = false
}
const submitAdd = () => {
  form.workData.push({ ...draft })
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
