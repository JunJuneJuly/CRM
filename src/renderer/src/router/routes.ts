
export const AppRoutes = [
  { 
    path: "/login", 
    name:'登录', 
    component: ()=>import('@views/login.vue') 
  },//路由配置规则数组
  { 
    path: "/", 
    name:'layout', 
    component: ()=>import('@layout/index.vue'),
    redirect: '/dashboard',
  },
]