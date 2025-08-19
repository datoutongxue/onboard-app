<template>
  <div class="login-page">
    <div style="display: flex; justify-content: center; padding: 30% 0 20% 0">
      <img style="width: 60%" src="@/assets/logo.svg" alt="logo" />
    </div>

    <div class="login-form">
      <van-form @submit="handleSubmit" @failed="onFailed" ref="formRef">
        <van-cell-group inset>
          <van-field
            v-model="selectedMethod"
            label="验证方式"
            name="selectType"
            placeholder="请选择验证方式"
            readonly
            @click="showSelect = true"
          >
            <template #input>
              <input type="text" readonly style="width: 100%" :disabled="passVerification" :value="validateList[selectedMethod].label" />
            </template>
          </van-field>
        </van-cell-group>

        <van-cell-group inset style="margin-top: 20px">
          <van-field
            v-if="selectedMethod === 'phone'"
            v-model="phone"
            label="手机号"
            type="tel"
            name="phoneNumber"
            required
            :disabled="passVerification"
            :rules="[{ required: true, validator: validateMobile, message: '个人手机必填' }]"
            placeholder="请输入验证手机号"
          />
        </van-cell-group>

        <van-cell-group inset>
          <van-field
            v-if="selectedMethod === 'email'"
            v-model="email"
            label="邮箱"
            placeholder="请输入邮箱"
            name="email"
            type="email"
            :disabled="passVerification"
            :rules="[{ required: true, validator: validateEmail, message: '邮箱必填' }]"
            required
          />
        </van-cell-group>

        <van-cell-group inset style="margin-top: 20px">
          <van-field
            v-model="verificationCode"
            center
            name="verificationCode"
            required
            :rules="[{ required: true, message: '验证码必填' }]"
            label="验证码"
            placeholder="请输入验证码"
          >
            <template #button>
              <van-button type="primary" @click="getCaptcha" :disabled="passVerification">
                {{ passVerification ? '已发送 ' + computedCountDowm : '获取验证码' }}
              </van-button>
            </template>
          </van-field>
        </van-cell-group>

        <div style="margin: 50px auto 0; width: 50%">
          <van-button class="submit-button" type="primary" block native-type="submit">提交</van-button>
        </div>

        <van-popup v-model:show="showSelect" position="bottom" safe-area-inset-bottom>
          <van-picker :columns="selectArr" @confirm="selectConfirm" @cancel="() => (showSelect = false)" />
        </van-popup>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { showToast } from 'vant'
import { apiConfirmPhoneCode, apiConfirmEmailCode, apiVerifyCode } from '@/api/onboard'
import { useRouter } from 'vue-router'

const router = useRouter()

const state = reactive({
  selectedMethod: 'phone' as 'phone' | 'email',
  validateList: {
    phone: { label: '手机号验证', pattern: /^1\d{10}$/ },
    email: { label: '邮箱验证', pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ },
  },
  phone: '',
  email: '',
  verificationCode: '',
  passVerification: false,
  showLoading: false,
  goalCaptcha: '',
})

const countDownNumber = ref(60)
const showSelect = ref(false)
const formRef = ref<any>()
const selectArr = [
  { text: '手机号验证', value: 'phone' },
  { text: '邮箱验证', value: 'email' },
]

const computedCountDowm = computed(() => (countDownNumber.value < 10 ? '0' + countDownNumber.value : countDownNumber.value))

const onFailed = () => {}

const selectConfirm = (e: any) => {
  state.selectedMethod = e.selectedValues?.[0] || e?.value
  state.phone = ''
  state.email = ''
  showSelect.value = false
}

const validateMobile = (val: string) => {
  const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
  if (!reg.test(val)) return `手机号码格式不正确'`
  return true
}
const validateEmail = (val: string) => {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+/
  if (!reg.test(val)) return `邮箱格式不正确'`
  return true
}

let timer: any
const startCountDown = () => {
  state.passVerification = true
  countDownNumber.value = 60
  clearInterval(timer)
  timer = setInterval(() => {
    countDownNumber.value -= 1
    if (countDownNumber.value <= 0) {
      clearInterval(timer)
      state.passVerification = false
    }
  }, 1000)
}

const getCaptcha = async () => {
  try {
    const result = state.selectedMethod === 'phone' ? await apiConfirmPhoneCode(state.phone) : await apiConfirmEmailCode(state.email)
    if (typeof result.data === 'string') {
      showToast({ message: result.data, position: 'middle' })
      state.passVerification = false
      return
    }
    if (result.data.validatecode == null) {
      showToast({ message: '请填写正确的号码!', position: 'middle' })
    } else {
      state.goalCaptcha = result.data.validatecode
      showToast({ message: '验证码已发送!', position: 'middle' })
    }
    sessionStorage.setItem('verificationCode', JSON.stringify(result.data.validatecode))
    sessionStorage.setItem('timestamp', JSON.stringify(result.data.timestamp))
    startCountDown()
  } catch (e) {
    showToast({ message: '验证码获取失败', type: 'fail', position: 'middle' })
  }
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  if (state.verificationCode !== state.goalCaptcha) {
    showToast({ message: '验证码错误', position: 'middle' })
    return
  }
  const code = JSON.parse(sessionStorage.getItem('verificationCode') || 'null')
  const timestamp = JSON.parse(sessionStorage.getItem('timestamp') || 'null')
  state.showLoading = true
  try {
    await apiVerifyCode(state.verificationCode, code, timestamp)
    showToast({ message: '提交成功', type: 'success', position: 'middle' })
    sessionStorage.setItem('selectedMethod', state.selectedMethod)
    sessionStorage.setItem('userInput', state.selectedMethod === 'phone' ? state.phone : state.email)
    router.replace({ name: 'hr' })
  } catch (e) {
    showToast({ message: '提交失败', type: 'fail', position: 'middle' })
  } finally {
    state.showLoading = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
}
</style>

