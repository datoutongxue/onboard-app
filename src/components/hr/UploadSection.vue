<template>
  <van-collapse-item title="附件上传" name="upload">
    <van-cell-group inset>
      <van-field
        :rules="[{ required: true, message: '身份证人像面扫描件必填' }]"
        label="*身份证人像面扫描件:"
        name="sfzzmsmjhzzy"
      >
        <template #input>
          <van-uploader
            :after-read="(file) => afterRead(file, '身份证人像面扫描件')"
            :before-read="beforeRead"
            :max-count="1"
            accept=".png,.jpg,.pdf"
            max-size="5242880"
            v-model="form.sfzzmsmjhzzy"
          />
        </template>
      </van-field>
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        :rules="[{ required: true, message: '身份证国微面扫描件必填' }]"
        label="*身份证国微面扫描件:"
        name="sfzfmsmj"
      >
        <template #input>
          <van-uploader
            :after-read="(file) => afterRead(file, '身份证国微面扫描件')"
            :before-read="beforeRead"
            :max-count="1"
            accept=".png,.jpg,.pdf"
            max-size="5242880"
            v-model="form.sfzfmsmj"
          />
        </template>
      </van-field>
    </van-cell-group>
    <van-cell-group inset>
      <van-field :label="lzzmLabel" :rules="lzzmRules" name="lzzmsmj">
        <template #input>
          <van-uploader
            :after-read="(file) => afterRead(file, '离职证明扫描件')"
            :before-read="beforeRead"
            :max-count="1"
            accept=".png,.jpg,.pdf"
            max-size="5242880"
            v-model="form.lzzmsmj"
          />
        </template>
      </van-field>
    </van-cell-group>
  </van-collapse-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import http from '@/api/http'
import { useOnboardStore } from '@/stores/onboard'
import { showFailToast, showSuccessToast } from 'vant'

const store = useOnboardStore()
const form = store.userInfoForm

const lzzmRules = computed(() => [
  { required: form.lzzmsmjId === '' && form.sfylzzm === '0', message: '离职证明扫描件必填' } as any,
])
const lzzmLabel = computed(() =>
  form.sfylzzm === '0' && form.lzzmsmjId === '' ? '*离职证明扫描件:' : '离职证明扫描件:',
)

const beforeRead = (file: File) => {
  if (file.type !== 'application/pdf' && file.type !== 'image/jpeg' && file.type !== 'image/png') {
    showFailToast({ message: '只能上传pdf,jpg,png格式的文件', position: 'middle' })
    return false
  }
  if (file.size > 5 * 1024 * 1024) {
    showFailToast({ message: '上传文件大小不能超过5M', position: 'middle' })
    return false
  }
  return true
}

const afterRead = async (file: any, text: string) => {
  file.status = 'uploading'
  file.message = '上传中...'
  const config = {
    headers: { 'Content-Type': 'multipart/form-data', Accept: '*/*' },
    withCredentials: true,
  }
  const formData = new FormData()
  formData.append('name', file.file.name)
  formData.append('secretLevel', '')
  formData.append('ts', String(Date.now()))
  formData.append('file', file.file)
  try {
    const res = await http.post(
      '/api/formmode/card/docUpload?detailtype=2&category=,,49&mainId=&subId=&secId=49',
      formData,
      config,
    )
    const id = res.data?.data?.imagefileid
    if (text === '上传附件') {
      // 拆分的证书模块使用独立字段
    } else if (text === '离职证明扫描件') {
      form.lzzmsmjId = id
    } else if (text === '身份证国微面扫描件') {
      form.sfzfmsmjId = id
    } else if (text === '身份证人像面扫描件') {
      form.sfzzmsmjhzzyId = id
    }
    file.status = 'done'
    file.message = '上传成功'
    showSuccessToast({ message: '上传成功', position: 'middle' })
  } catch {
    showFailToast({ message: '上传失败', position: 'middle' })
  }
}
</script>
