import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Axios } from 'axios'
import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.globalProperties.$http = Axios;
app.use(createPinia())
app.use(Quasar, {})
app.use(router)

app.mount('#app')
