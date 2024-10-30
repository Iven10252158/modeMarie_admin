import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'virtual:svg-icons-register'
import '@/assets/styles/index.scss'
import { setupCalendar, Calendar, DatePicker } from 'v-calendar'

const app = createApp(App)
const pinia = createPinia()

app.use(setupCalendar, {})
app.use(router)
app.use(pinia)
app.use(VueAxios, axios)
app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)
app.mount('#app')
