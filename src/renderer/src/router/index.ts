import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@views/login.vue'
import About from '@views/about.vue'

export default createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: Login },//路由配置规则数组
    { path: "/about", component: About },
  ],
})