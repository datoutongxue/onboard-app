<template>
  <div class="login-page">
    <transition>
      <van-loading
        type="spinner"
        v-show="showLoading"
        vertical
        :size="36"
        :text-color="'#ffffff'"
        style="
          position: absolute;
          width: 100vw;
          height: 100vh;
          display: flex;
          z-index: 10;
          justify-content: center;
          align-items: center;
          background: rgba(73, 73, 73, 0.8);
          transform: all 1s;
        "
      >
        加载中。。。
      </van-loading>
    </transition>

    <div>
      <div style="display: flex; justify-content: center; padding: 30% 0 20% 0">
        <img style="width: 60%" src="@/assets/logo.svg" alt="logo" />
      </div>
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
              <input
                type="text"
                readonly
                style="width: 100%"
                :disabled="passVerification"
                :value="validateList[selectedMethod].label"
              />
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

        <van-dialog
          style="padding: 20px"
          :lazy-render="true"
          v-model:show="showVerify"
          title="人机验证"
          :show-cancel-button="false"
          :show-confirm-button="false"
        >
          <canvas
            :class="cvsClass"
            :height="verifyObj.height"
            :style="`width:${verifyObj.width};margin:auto`"
            ref="cvs"
          ></canvas>
        </van-dialog>

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
              <van-button type="primary" @click="generateCaptcha" :disabled="passVerification">
                {{ passVerification ? '已发送 ' + computedCountDowm : '获取验证码' }}
              </van-button>
            </template>
          </van-field>
        </van-cell-group>

        <div style="margin: 50px auto 0; width: 50%">
          <van-button class="submit-button" type="primary" block native-type="submit"
            >提交</van-button
          >
        </div>
        <van-popup v-model:show="showSelect" position="bottom" safe-area-inset-bottom>
          <van-picker
            :columns="selectArr"
            @confirm="selectConfirm"
            @cancel="() => (showSelect = false)"
          />
        </van-popup>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref, watch, nextTick, computed } from 'vue'
import { showToast, showFailToast } from 'vant'
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
  sliderValue: 0,
  verificationCode: '',
  passVerification: false,
  showLoading: false,
  goalCaptcha: '',
})

const countDownNumber = ref(60)
const showSelect = ref(false)
const showVerify = ref(false)
const formRef = ref<any>()
const selectArr = [
  { text: '手机号验证', value: 'phone' },
  { text: '邮箱验证', value: 'email' },
]

const jumpHr = () => {
  router.replace({ name: 'hr' })
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
    sessionStorage.setItem(
      'userInput',
      state.selectedMethod === 'phone' ? state.phone : state.email,
    )
    jumpHr()
  } catch (e) {
    showToast({ message: '提交失败', type: 'error', position: 'middle' })
  } finally {
    state.showLoading = false
  }
}

const selectConfirm = (e: any) => {
  state.selectedMethod = e.selectedValues?.[0] || e?.value
  state.phone = ''
  state.email = ''
  showSelect.value = false
}

const validateMobile = (val: string) => {
  const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
  if (!reg.test(val)) {
    return `手机号码格式不正确'`
  }
}

const validateEmail = (val: string) => {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+/
  if (!reg.test(val)) {
    return `邮箱格式不正确'`
  }
}

let timer: any
const computedCountDowm = computed(() => {
  if (state.passVerification && countDownNumber.value <= 0) {
    clearTimeout(timer)
    state.passVerification = false
    vfcx?.reset?.()
    return
  } else {
    timer = setTimeout(() => {
      countDownNumber.value = +countDownNumber.value - 1
    }, 1000)
    return countDownNumber.value < 10 ? '0' + countDownNumber.value : countDownNumber.value
  }
})

const verifyObj = reactive({
  servertest: false,
  width: '100%',
  height: 50,
  strokeWidth: 10,
  dropWidth: 50,
  show: true,
  dropColor: '#fff',
  tipNoneColor: '#000',
  tipSucColor: '#fff',
  tipTestIngColor: '#fff',
  tipTailColor: '#ee0a24',
  testTip: '正在验证...',
  slideColor: '#e8e8e8',
  tipTxt: '向右滑动验证',
  successBgColor: '#1989fa',
  tailBgColor: '#ee0a24',
  activeBgColor: '#1989fa',
  testIngBgColor: '#ff976a',
  successTip: '验证通过！',
  failTip: '验证失败，请重试',
  fontSize: 16,
})

let vfcx: any = null
const cvs = ref<HTMLCanvasElement | null>(null)
const cvsClass = ref('cur-none')
let vfcres = { startX: 0, endX: 0, timed: 0, guiji: [], width: verifyObj.width as any }
const vfcStatu = reactive({
  statu: 'none' as 'none' | 'testing' | 'servertest' | 'tail' | 'success',
})

watch(vfcStatu, (res) => {
  if (!res.statu || !vfcx) return
  if (res.statu === 'success') {
    vfcx.anmateOff = false
    vfcx.activeBgColor = verifyObj.successBgColor
    vfcx.tipTxt = verifyObj.successTip
    vfcx.evNone?.()
    state.showLoading = true
    showVerify.value = false
    setTimeout(async () => {
      try {
        const result =
          state.selectedMethod === 'phone'
            ? await apiConfirmPhoneCode(state.phone)
            : await apiConfirmEmailCode(state.email)
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
        state.passVerification = true
        countDownNumber.value = 60
      } catch (e) {
        showToast({ message: '验证码获取失败', type: 'error', position: 'middle' })
      } finally {
        state.showLoading = false
        vfcx.reset?.()
        vfcx.tipTxt = verifyObj.failTip
        vfcx.fontColor = verifyObj.tipTailColor
        vfcx.draw?.()
      }
    }, 1500)
  } else if (res.statu === 'tail') {
    vfcx.reset?.()
    vfcx.tipTxt = verifyObj.failTip
    vfcx.fontColor = verifyObj.tipTailColor
    vfcx.draw?.()
  }
})

// Vfcs class copied and adapted 1:1 from original inline script
class Vfcs {
  constructor(
    cvsEl: HTMLCanvasElement,
    cvsClass: any,
    vfcres: any,
    vfcStatu: any,
    strokeWidth: number,
    dropWidth: number,
    fontSize: number,
    servertest: boolean,
    colors: any,
    tipTxt: any,
  ) {
    this.cvsEl = cvsEl
    this.vfcres = vfcres
    this.cvsClass = cvsClass
    this.strokeWidth = strokeWidth
    this.dropWidth = dropWidth
    this.vfcStatu = vfcStatu
    this.colors = colors
    this.fontSize = fontSize
    this.dwonIsPath = false
    this.ctx = null
    this.allTipTxts = tipTxt
    this.tipTxt = this.allTipTxts.tipTxt
    this.fontColor = this.colors.tipNoneColor
    this.activeBgColor = this.colors.activeBgColor
    this.servertest = servertest
    this.guiji = []
    this.startTime = 0
    this.endTime = 0
    this.startX = 0
    this.startY = 0
    this.moveX = 0
    this.moveY = 0
    this.fontOp = 1
    this.met = false
    this.offX = 0
    this.minX = this.strokeWidth / 2
    this.maxX = 0
    this.dropX = 0
    this.toTouchEnd = false
    this.isDown = false
    this.testAm = null as any
    this.anmateOff = true
    this.evsName = [] as any
    this.evsFun = [this.down.bind(this), this.move.bind(this), this.up.bind(this)]
    this.init()
  }
  cvsEl!: HTMLCanvasElement
  vfcres: any
  cvsClass: any
  strokeWidth: number
  dropWidth: number
  vfcStatu: any
  colors: any
  fontSize: number
  dwonIsPath: boolean
  ctx: CanvasRenderingContext2D | null
  allTipTxts: any
  tipTxt: string
  fontColor: string
  activeBgColor: string
  servertest: boolean
  guiji: any[]
  startTime: number
  endTime: number
  startX: number
  startY: number
  moveX: number
  moveY: number
  fontOp: number
  met: boolean
  offX: number
  minX: number
  maxX: number
  dropX: number
  toTouchEnd: boolean
  isDown: boolean
  testAm: any
  anmateOff: boolean
  evsName: string[]
  evsFun: any[]

  init() {
    this.ctx = this.cvsEl.getContext('2d')
    this.cvsEl.width = this.cvsEl.clientWidth
    this.maxX = this.cvsEl.width - this.dropWidth - this.strokeWidth
    this.dropX = this.minX + this.offX
    this.draw()
    this.evsName = this.evType()
    this.evsName.forEach((evName, i) =>
      i === 0
        ? this.cvsEl.addEventListener(evName, this.evsFun[i])
        : document.addEventListener(evName, this.evsFun[i]),
    )
  }
  draw() {
    const cW = this.cvsEl.width
    const cH = this.cvsEl.height
    const c = this.ctx!
    c.clearRect(0, 0, cW, cH)
    c.globalAlpha = this.fontOp
    c.fillRect(0, 0, cW, cH)
    c.fillStyle = this.colors.slideColor
    c.strokeStyle = this.colors.slideColor
    c.lineWidth = this.strokeWidth
    c.fillRect(0, 0, cW, cH)
    c.strokeRect(0, 0, cW, cH)
    c.fillStyle = this.activeBgColor
    c.strokeStyle = this.activeBgColor
    c.fillRect(this.minX + 2, this.minX, this.offX, cH - this.strokeWidth)
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.fillStyle = this.fontColor
    c.font = `${this.fontSize}px 黑体`
    c.fillText(this.tipTxt, cW / 2, cH / 2)
    if (['none', 'testing', 'servertest', 'tail'].includes(this.vfcStatu.statu)) {
      c.beginPath()
      c.fillStyle = this.colors.dropColor
      c.rect(this.dropX, this.minX, this.dropWidth, cH - this.strokeWidth)
      c.fill()
      c.lineWidth = 2
      c.moveTo(this.dropX + this.dropWidth / 1.7 - 5, this.strokeWidth + 10)
      c.lineTo(this.dropX + this.dropWidth / 1.7 + 5, cH / 2)
      c.lineTo(this.dropX + this.dropWidth / 1.7 - 5, cH - this.strokeWidth - 10)
      c.moveTo(this.dropX + this.dropWidth / 1.7 - 15, this.strokeWidth + 10)
      c.lineTo(this.dropX + this.dropWidth / 1.7 - 5, cH / 2)
      c.lineTo(this.dropX + this.dropWidth / 1.7 - 15, cH - this.strokeWidth - 10)
      c.stroke()
      c.closePath()
    } else if (this.vfcStatu.statu === 'success') {
      c.beginPath()
      c.fillStyle = this.colors.dropColor
      c.rect(this.dropX, this.minX, this.dropWidth, cH - this.strokeWidth)
      c.fill()
      c.closePath()
      c.beginPath()
      c.fillStyle = this.colors.successBgColor
      c.arc(this.dropWidth / 2 + this.dropX, cH / 2, cH / 3, 0, 2 * Math.PI)
      c.fill()
      c.closePath()
      c.beginPath()
      c.lineWidth = 3
      c.lineJoin = 'bevel'
      c.lineCap = 'round'
      c.strokeStyle = this.colors.dropColor
      c.moveTo(this.dropX + this.dropWidth / 2 - 8, cH / 2 + 1)
      c.lineTo(this.dropX + this.dropWidth / 2.1, cH / 1.6)
      c.lineTo(this.dropX + this.dropWidth / 2 + 8, cH / 2 - 5)
      c.stroke()
      c.closePath()
    }
  }
  down(ev: any) {
    if (['testing', 'servertest'].includes(this.vfcStatu.statu)) return
    this.setXY(ev)
    this.isDown = true
    this.startTime = Date.now()
    const isPath = this.ctx!.isPointInPath(this.startX, this.startY)
    this.dwonIsPath = isPath
  }
  move(ev: any) {
    if (['testing', 'servertest'].includes(this.vfcStatu.statu)) return
    this.setXY(ev)
    const isPath = this.ctx!.isPointInPath(this.moveX, this.moveX)
    if ((ev as MouseEvent).x) this.cvsClass.value = isPath ? 'cur' : 'cur-none'
    const x = Number(this.moveX.toFixed(2))
    const y = Number(this.moveY.toFixed(2))
    const moveTime = Date.now()
    this.guiji.push({ x, y, moveTime })
    if (!this.dwonIsPath || this.moveX <= 0) return
    if (this.isDown === true) {
      this.toTouchEnd = this.touchDrosToEnd()
      if (this.toTouchEnd === true) this.up()
      this.draw()
    }
  }
  up() {
    if (
      ['testing', 'servertest'].includes(this.vfcStatu.statu) ||
      this.offX === 0 ||
      this.dwonIsPath === false ||
      this.moveX <= 0
    )
      return
    this.endTime = Date.now()
    this.vfcres.startX = this.startX
    this.vfcres.endX = this.dropX + this.dropWidth + this.minX
    this.vfcres.timed = this.endTime - this.startTime
    this.vfcres.guiji = this.guiji
    this.vfcres.width = this.cvsEl.width
    this.dwonIsPath = false
    this.isDown = false
    if (this.toTouchEnd === false) {
      this.dropX = this.minX
      this.offX = 0
      this.tipTxt = this.allTipTxts.failTip
      this.fontColor = this.colors.tipTailColor
    } else {
      this.vfcStatu.statu = 'testing'
      this.testAdmate()
      this.fontColor = this.colors.tipTestIngColor
      this.tipTxt = this.allTipTxts.testTip
      this.activeBgColor = this.colors.testIngBgColor
      this.dropX = this.maxX + this.minX
      const test = this.testVer()
      setTimeout(() => {
        if (test === 'success') {
          if (this.servertest === true) {
            this.vfcStatu.statu = 'servertest'
          } else {
            this.vfcStatu.statu = 'success'
          }
        } else {
          this.vfcStatu.statu = 'tail'
        }
      }, 1000)
    }
    this.draw()
    this.guiji = []
  }
  reset() {
    this.dropX = this.minX
    this.anmateOff = false
    this.activeBgColor = this.colors.activeBgColor
    this.fontColor = this.colors.tipNoneColor
    this.tipTxt = this.allTipTxts.tipTxt
    this.offX = 0
    this.toTouchEnd = false
    this.guiji = []
    this.slideColor = this.colors.slideColor
    this.testIngBgColor = this.colors.testIngBgColor
    this.successBgColor = this.colors.successBgColor
    this.vfcStatu.statu = 'none'
    this.ctx!.fillStyle = '#ffffff'
    this.ctx!.strokeStyle = '#ffffff'
    this.draw()
  }
  evNone() {
    this.evsName.forEach((evName, i) =>
      i === 0
        ? this.cvsEl.removeEventListener(evName, this.evsFun[i])
        : document.removeEventListener(evName, this.evsFun[i]),
    )
  }
  testAdmate() {
    if (this.met === false && this.fontOp >= 1) this.met = true
    else if (this.met === true && this.fontOp <= 0.5) this.met = false
    this.met === false ? (this.fontOp += 0.015) : (this.fontOp -= 0.015)
    this.draw()
    cancelAnimationFrame(this.testAm)
    this.testAm = window.requestAnimationFrame(this.testAdmate.bind(this))
    if (this.anmateOff === false) {
      cancelAnimationFrame(this.testAm)
      this.fontOp = 1
      this.testAm = null
      this.met = false
      this.anmateOff = true
    }
    this.draw()
  }
  touchDrosToEnd() {
    const x = this.offX + this.dropWidth + this.strokeWidth
    const isSuccess = x >= this.cvsEl.width
    return isSuccess
  }
  setXY(ev: any) {
    const rect = this.cvsEl.getBoundingClientRect()
    if (ev.type === 'touchstart') {
      this.startX = ev.touches[0].clientX - rect.left
      this.startY = ev.touches[0].clientY - rect.top
    }
    if (ev.type === 'touchmove') {
      this.moveX = ev.touches[0].clientX - rect.left
      this.moveY = ev.touches[0].clientY - rect.top
    }
    if (ev.type === 'mousedown') {
      this.startX = (ev as MouseEvent).x - rect.left
      this.startY = (ev as MouseEvent).y - rect.top
    }
    if (ev.type === 'mousemove') {
      this.moveX = (ev as MouseEvent).x - rect.left
      this.moveY = (ev as MouseEvent).y - rect.top
    }
    if (ev.type === 'mousemove' || ev.type === 'touchmove') {
      this.offX = this.moveX - this.startX
      if (this.offX > this.maxX) this.offX = this.maxX
      if (this.offX < this.minX) this.offX = this.minX
      this.dropX = this.minX + this.offX
    }
  }
  evType() {
    const isMobile =
      /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/i.test(
        navigator.userAgent,
      )
    return isMobile
      ? ['touchstart', 'touchmove', 'touchend']
      : ['mousedown', 'mousemove', 'mouseup']
  }
  arrCmp() {
    const repeatX: any[] = []
    const repeatY: any[] = []
    const timed: any[] = []
    const chaArr = this.guiji.reduce((prev: any[], itm: any, i: number, arr: any[]) => {
      if (i === arr.length - 1) return prev
      const nv = arr[i + 1]
      const chaX = Number((nv.x - itm.x).toFixed(2))
      const chaY = Number((nv.y - itm.y).toFixed(2))
      const timeCha = nv.moveTime - itm.moveTime
      timed.push(timeCha)
      const rx = repeatX.findIndex((it: any) => it.num === chaX)
      const ry = repeatY.findIndex((it: any) => it.num === chaY)
      if (rx === -1) repeatX.push({ num: chaX, count: 1 })
      else repeatX[rx].count++
      if (ry === -1) repeatY.push({ num: chaY, count: 1 })
      else repeatY[ry].count++
      prev.push({ x: chaX, y: chaY })
      return prev
    }, [] as any[])
    const findXCount = repeatX.map((it: any) => it.count)
    const findYCount = repeatY.map((it: any) => it.count)
    const repeatMaxXCount = Math.max(...findXCount)
    const repeatMaxYCount = Math.max(...findYCount)
    const repeatMaxTimed = Math.max(...timed)
    return { chaArr, repeatX, repeatY, repeatMaxXCount, repeatMaxYCount, repeatMaxTimed }
  }
  testVer() {
    if (this.vfcres.timed < 50) return 'tail'
    const sliderInfo = this.arrCmp()
    const timeTest = sliderInfo.repeatMaxTimed === sliderInfo.chaArr.length
    if (timeTest === true) return 'tail'
    if ((sliderInfo as any).repeatMaxXCount === (sliderInfo as any).repeatX) return 'tail'
    if ((sliderInfo as any).repeatMaxYCount === sliderInfo.chaArr.length) return 'tail'
    return 'success'
  }
}

const colors = reactive({
  activeBgColor: verifyObj.activeBgColor,
  testIngBgColor: verifyObj.testIngBgColor,
  successBgColor: verifyObj.successBgColor,
  tipSucColor: verifyObj.tipSucColor,
  tipTailColor: verifyObj.tipTailColor,
  tipTestIngColor: verifyObj.tipTestIngColor,
  tipNoneColor: verifyObj.tipNoneColor,
  dropColor: verifyObj.dropColor,
  slideColor: verifyObj.slideColor,
})
const tipTxt = reactive({
  testTip: verifyObj.testTip,
  tipTxt: verifyObj.tipTxt,
  successTip: verifyObj.successTip,
  failTip: verifyObj.failTip,
})

const generateCaptcha = async () => {
  await formRef.value?.validate(['phoneNumber', 'email'])
  state.passVerification = false
  if (!state.passVerification) {
    showVerify.value = true
    nextTick(() => {
      vfcx = new Vfcs(
        cvs.value as HTMLCanvasElement,
        cvsClass,
        vfcres,
        vfcStatu,
        verifyObj.strokeWidth,
        verifyObj.dropWidth,
        verifyObj.fontSize,
        verifyObj.servertest,
        colors,
        tipTxt,
      )
    })
  }
}

const {
  selectedMethod,
  validateList,
  phone,
  email,
  verificationCode,
  passVerification,
  showLoading,
  goalCaptcha,
} = toRefs(state)
</script>

<style scoped>
.login-page {
  padding: 16px;
}
</style>
