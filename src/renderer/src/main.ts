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

//自定义指令
import {AuthDirective} from './directives/auths.directives'
app.directive(AuthDirective.name,AuthDirective);

import useDicts from '@mixins/DIctsPlugin.ts'
const store = createPinia()
store.use(piniaPluginPersist)
app.use(useDicts)
import pagination from '@components/pagination/index.vue'
app.component('pagination', pagination); 
app.use(router).use(store).use(i18n).mount('#app')
