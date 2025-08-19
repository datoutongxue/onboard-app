<template>
  <van-collapse-item title="*家庭成员(必填)" name="family">
    <van-cell-group inset>
      <van-button type="primary" size="mini" @click="openAdd">添加家庭成员</van-button>
      <van-button class="ml" type="primary" size="mini" @click="deleteAll"
        >删除所有家庭成员</van-button
      >
      <van-row justify="center" class="mt">
        <van-col span="6">姓名</van-col>
        <van-col span="4">关系</van-col>
        <van-col span="6">联系电话</van-col>
        <van-col span="6"></van-col>
      </van-row>
      <van-row justify="center" class="mt" v-for="(item, index) in form.familyData" :key="index">
        <van-col span="6">{{ item.name }}</van-col>
        <van-col span="4">{{ item.relText }}</van-col>
        <van-col span="6">{{ item.tel }}</van-col>
        <van-col class="ml" span="3"><a href="#" @click="viewDetail(index)">详情</a></van-col>
        <van-col span="3"><a href="#" @click="deleteOne(index)">删除</a></van-col>
      </van-row>
      <van-row justify="center" class="mt" v-show="!form.familyData.length">暂无数据</van-row>
    </van-cell-group>
  </van-collapse-item>

  <van-toast v-model:show="detailShow" style="padding: 20px" :duration="5000">
    <template #message>
      <p>
        <span>姓名 :</span> <span>{{ detail.name }}</span>
      </p>
      <p>
        <span>关系 :</span> <span>{{ detail.relText }}</span>
      </p>
      <p>
        <span>所在单位 :</span> <span>{{ detail.company }}</span>
      </p>
      <p>
        <span>联系电话:</span> <span>{{ detail.tel }}</span>
      </p>
    </template>
  </van-toast>

  <van-dialog
    v-model:show="addShow"
    title="添加家庭成员"
    :show-cancel-button="false"
    :show-confirm-button="false"
  >
    <van-form @submit="submitAdd">
      <van-cell-group inset>
        <van-field
          v-model="draft.name"
          label="*人员姓名 :"
          :rules="[{ required: true, message: '人员姓名必填' }]"
          placeholder="请输入人员姓名"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="draft.relText"
          label="*关系 :"
          is-link
          readonly
          placeholder="请选择关系"
          @click="pickers.showRel = true"
          :rules="[{ required: true, message: '请选择家庭成员关系' }]"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field v-model="draft.company" label="所在单位 :" placeholder="请输入所在单位" />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="draft.tel"
          label="*联系电话 :"
          :rules="[{ required: true, message: '联系电话必填' }]"
          placeholder="请输入联系电话"
        />
      </van-cell-group>
      <div style="margin: 16px" class="addLearningClass">
        <van-button type="primary" size="mini" native-type="submit">确定</van-button>
        <van-button type="primary" size="mini" class="ml" @click="addShow = false">取消</van-button>
      </div>
    </van-form>
  </van-dialog>

  <van-popup v-model:show="pickers.showRel" position="bottom" safe-area-inset-bottom>
    <van-picker :columns="familyRels" @confirm="onRelConfirm" @cancel="pickers.showRel = false" />
  </van-popup>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useOnboardStore } from '@/stores/onboard'
import { showFailToast } from 'vant'

const store = useOnboardStore()
const form = store.userInfoForm
const familyRels = [
  { text: '配偶', value: '0' },
  { text: '父亲', value: '1' },
  { text: '母亲', value: '2' },
  { text: '子女', value: '3' },
  { text: '兄弟姐妹', value: '4' },
  { text: '其他亲属关系', value: '5' },
]

const detailShow = ref(false)
const detail = reactive<any>({})
const addShow = ref(false)
const pickers = reactive({ showRel: false })
const draft = reactive<any>({ name: '', relText: '', rel: '', company: '', tel: '' })

const openAdd = () => {
  Object.assign(draft, { name: '', relText: '', rel: '', company: '', tel: '' })
  addShow.value = true
}
const deleteAll = () => {
  form.familyData = []
  showFailToast('删除成功')
}
const deleteOne = (index: number) => {
  if (form.familyData.length) {
    form.familyData.splice(index, 1)
    showFailToast('删除成功')
  }
}
const viewDetail = (index: number) => {
  Object.assign(detail, form.familyData[index])
  detailShow.value = true
}
const onRelConfirm = ({ selectedOptions }: any) => {
  draft.relText = selectedOptions[0]?.text
  draft.rel = selectedOptions[0]?.value
  pickers.showRel = false
}
const submitAdd = () => {
  form.familyData.push({ ...draft })
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
