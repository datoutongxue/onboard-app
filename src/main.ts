import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import 'vant/lib/index.css'
import '@vant/touch-emulator'

import App from './App.vue'
import router from './router'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia()
pinia.use(createPersistedState())
const i18n = createI18n({ legacy: false, locale: 'zh-CN', messages: {} })

app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
