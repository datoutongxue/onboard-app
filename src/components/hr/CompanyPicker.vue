<template>
  <van-cell-group inset>
    <van-field
      v-model="form.companyText"
      is-link
      readonly
      required
      name="company"
      label="入职公司 :"
      placeholder="选择入职公司"
      @click="form.showPickerCompany = true"
      :rules="[{ required: true, message: '入职公司必选' }]"
    />
    <van-popup v-model:show="form.showPickerCompany" round position="bottom" style="height: 50%">
      <div style="height: 100%; display: flex; flex-direction: column">
        <van-search
          v-model="companySearchText"
          placeholder="请输入公司名称搜索"
          @update:model-value="filterCompanys"
          style="flex-shrink: 0"
        />
        <div style="flex: 1; overflow-y: auto">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in filteredCompanys"
              :key="index"
              :title="item.text"
              clickable
              @click="onCompanyConfirm(item)"
            />
          </van-cell-group>
        </div>
      </div>
    </van-popup>
  </van-cell-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useOnboardStore } from '@/stores/onboard'
import http from '@/api/http'

const store = useOnboardStore()
const form = store.userInfoForm
const companySearchText = ref('')
const filteredCompanys = ref<Array<{ text: string; value: string }>>([])

async function getAllCompany() {
  const { data } = await http.get('/api/OnboardMobile/getInitInfo')
  const list = (data.companys || []).map((c: any) => ({
    text: `${c.gsmc}(${c.gsdm})`,
    value: c.gsdm,
  }))
  filteredCompanys.value = list
}

getAllCompany()

const filterCompanys = () => {
  if (!companySearchText.value) {
    getAllCompany()
    return
  }
  const searchText = companySearchText.value.toLowerCase()
  filteredCompanys.value = filteredCompanys.value.filter((company: any) =>
    company.text.toLowerCase().includes(searchText),
  )
}

const onCompanyConfirm = (company: any) => {
  form.companyText = company.text
  form.company = company.value
  form.showPickerCompany = false
}
</script>
