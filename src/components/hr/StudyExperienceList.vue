<template>
  <van-collapse-item title="*学习经历(必填)" name="3">
    <van-cell-group inset>
      <van-tag type="warning">! 请从最高学历从上至下填写到高中即可</van-tag>
    </van-cell-group>
    <van-cell-group inset>
      <van-button type="primary" size="mini" @click="openAdd">添加学习经历</van-button>
      <van-button class="ml" type="primary" size="mini" @click="deleteAll"
        >删除所有学习经历</van-button
      >
      <van-row justify="center" class="mt">
        <van-col span="6">开始日期</van-col>
        <van-col span="6">结束日期</van-col>
        <van-col span="6">教育类型</van-col>
        <van-col span="6"></van-col>
      </van-row>
      <van-row justify="center" class="mt" v-for="(item, index) in form.studyData" :key="index">
        <van-col span="6">{{ item.startDate }}</van-col>
        <van-col span="6">{{ item.endDate }}</van-col>
        <van-col span="6">{{ item.typeText }}</van-col>
        <van-col span="3"><a href="#" @click="viewDetail(index)">详情</a></van-col>
        <van-col span="3"><a href="#" @click="deleteOne(index)">删除</a></van-col>
      </van-row>
      <van-row justify="center" class="mt" v-show="!form.studyData.length">暂无数据</van-row>
    </van-cell-group>
  </van-collapse-item>

  <!-- 详情 Toast -->
  <van-toast v-model:show="detailShow" style="padding: 20px" :duration="5000">
    <template #message>
      <p>
        <span>开始日期 :</span> <span>{{ detail.startDate }}</span>
      </p>
      <p>
        <span>结束日期 :</span> <span>{{ detail.endDate }}</span>
      </p>
      <p>
        <span>教育类型 :</span> <span>{{ detail.typeText }}</span>
      </p>
      <p>
        <span>学历证书 :</span> <span>{{ detail.educationText }}</span>
      </p>
      <p>
        <span>学位 :</span> <span>{{ detail.degree2Text }}</span>
      </p>
      <p>
        <span>机构/学校 :</span> <span>{{ detail.schoolName }}</span>
      </p>
      <p>
        <span>专业 :</span> <span>{{ detail.profession }}</span>
      </p>
    </template>
  </van-toast>

  <!-- 添加学习经历 Dialog -->
  <van-dialog
    v-model:show="addShow"
    title="添加学习经历"
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
          v-model="draft.typeText"
          label="*教育类型 :"
          is-link
          readonly
          placeholder="请选择教育类型"
          @click="pickers.showType = true"
          :rules="[{ required: true, message: '请选择教育类型' }]"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="draft.educationText"
          label="*学历证书 :"
          is-link
          readonly
          :placeholder="!draft.type ? '请先选择教育类型' : '请选择学历证书'"
          :disabled="!draft.type"
          @click="pickers.showEducation = true"
          :rules="[{ required: true, message: '请选择学历证书' }]"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="draft.degree2Text"
          label="*学位 :"
          is-link
          readonly
          :placeholder="!draft.type ? '请先选择教育类型' : '请选择学位'"
          :disabled="!draft.type"
          @click="pickers.showDegree = true"
          :rules="[{ required: true, message: '请选择学位' }]"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="draft.schoolName"
          label="*机构/学校 :"
          :rules="[{ required: true, message: '机构/学校必填' }]"
          placeholder="请输入机构/学校"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="draft.profession"
          label="*学习内容(专业) :"
          :rules="[{ required: true, message: '学习内容(专业)必填' }]"
          placeholder="请输入学习内容(专业)"
        />
      </van-cell-group>
      <div style="margin: 16px" class="addLearningClass">
        <van-button type="primary" size="mini" native-type="submit">确定</van-button>
        <van-button type="primary" size="mini" class="ml" @click="addShow = false">取消</van-button>
      </div>
    </van-form>
  </van-dialog>

  <!-- 选择器弹窗 -->
  <van-popup v-model:show="pickers.showStart" position="bottom" safe-area-inset-bottom>
    <van-date-picker
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onDateConfirm('startDate', $event, 'showStart')"
      @cancel="pickers.showStart = false"
    />
  </van-popup>
  <van-popup v-model:show="pickers.showEnd" position="bottom" safe-area-inset-bottom>
    <van-date-picker
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onDateConfirm('endDate', $event, 'showEnd')"
      @cancel="pickers.showEnd = false"
    />
  </van-popup>
  <van-popup v-model:show="pickers.showType" position="bottom" safe-area-inset-bottom>
    <van-picker :columns="jylxTypes" @confirm="onTypeConfirm" @cancel="pickers.showType = false" />
  </van-popup>
  <van-popup v-model:show="pickers.showEducation" position="bottom" safe-area-inset-bottom>
    <van-picker
      :columns="educationAndDegree2s.get(draft.type)?.[0] || []"
      @confirm="onEducationConfirm"
      @cancel="pickers.showEducation = false"
    />
  </van-popup>
  <van-popup v-model:show="pickers.showDegree" position="bottom" safe-area-inset-bottom>
    <van-picker
      :columns="educationAndDegree2s.get(draft.type)?.[1] || []"
      @confirm="onDegreeConfirm"
      @cancel="pickers.showDegree = false"
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

import { fetchDict } from '@/api/dict'
const educations = ref<Array<{ text: string; value: string }>>([])
const degrees = ref<Array<{ text: string; value: string }>>([])
const jylxTypes = ref<Array<{ text: string; value: string }>>([])
;(async () => {
  educations.value = await fetchDict('browser.hr_education')
  degrees.value = await fetchDict('browser.hr_degree2')
  jylxTypes.value = await fetchDict('browser.hr_study_type')
})()

const educationAndDegree2s = new Map<string, [Array<any>, Array<any>]>([
  [
    '0',
    [
      [
        { text: '高中', value: '06' },
        { text: '高中以下学历', value: '07' },
        { text: '高中结业证书', value: '20' },
      ],
      [{ text: '无学位', value: '09' }],
    ],
  ],
  ['1', [educations.value, degrees.value]],
  ['2', [educations.value, degrees.value]],
  ['3', [educations.value, degrees.value]],
  ['4', [educations.value, degrees.value]],
  ['5', [educations.value, degrees.value]],
  ['6', [educations.value, degrees.value]],
  ['7', [educations.value, degrees.value]],
  ['8', [[{ text: '中专', value: '05' }], [{ text: '无学位', value: '09' }]]],
  ['9', [[{ text: '中专', value: '05' }], [{ text: '无学位', value: '09' }]]],
  ['10', [[{ text: '中专', value: '05' }], [{ text: '无学位', value: '09' }]]],
  ['11', [educations.value, degrees.value]],
  ['21', [educations.value, degrees.value]],
  ['22', [educations.value, degrees.value]],
])

const detailShow = ref(false)
const detail = reactive<any>({})
const addShow = ref(false)
const draft = reactive<any>({
  startDate: '',
  endDate: '',
  type: '',
  typeText: '',
  education: '',
  educationText: '',
  degree2: '',
  degree2Text: '',
  schoolName: '',
  profession: '',
})
const pickers = reactive({
  showStart: false,
  showEnd: false,
  showType: false,
  showEducation: false,
  showDegree: false,
})

const openAdd = () => {
  Object.assign(draft, {
    startDate: '',
    endDate: '',
    type: '',
    typeText: '',
    education: '',
    educationText: '',
    degree2: '',
    degree2Text: '',
    schoolName: '',
    profession: '',
  })
  addShow.value = true
}
const deleteAll = () => {
  form.studyData = []
  showFailToast('删除成功')
}
const deleteOne = (index: number) => {
  if (form.studyData.length) {
    form.studyData.splice(index, 1)
    showFailToast('删除成功')
  }
}
const viewDetail = (index: number) => {
  const obj = form.studyData[index]
  Object.assign(detail, obj)
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
const onTypeConfirm = ({ selectedOptions }: any) => {
  draft.typeText = selectedOptions[0]?.text
  draft.type = selectedOptions[0]?.value
  draft.education = ''
  draft.educationText = ''
  draft.degree2 = ''
  draft.degree2Text = ''
  pickers.showType = false
}
const onEducationConfirm = ({ selectedOptions }: any) => {
  draft.educationText = selectedOptions[0]?.text
  draft.education = selectedOptions[0]?.value
  pickers.showEducation = false
}
const onDegreeConfirm = ({ selectedOptions }: any) => {
  draft.degree2Text = selectedOptions[0]?.text
  draft.degree2 = selectedOptions[0]?.value
  pickers.showDegree = false
}
const submitAdd = () => {
  form.studyData.push({ ...draft })
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