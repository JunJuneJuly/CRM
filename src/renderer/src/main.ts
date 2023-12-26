import { createApp } from 'vue'
import App from './App.vue'
import router from '@router/index.js'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/src/dark/css-vars.scss'
import i18n from './local/index'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const store = createPinia()
store.use(piniaPluginPersist)

app.use(router).use(store).use(i18n).mount('#app')
