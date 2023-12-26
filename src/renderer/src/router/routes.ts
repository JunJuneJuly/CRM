
export const AppRoutes = [
  { path: "/login", name:'登录', component: ()=>import('@views/login.vue') },//路由配置规则数组
  { 
    path: "/", 
    name:'首页', 
    component: ()=>import('@layout/index.vue'),
    redirect: '/dashboard',
    children:[
      {
        path:'/dashboard',
        component:()=>import('@views/home/index.vue')
      }
    ]
  },
  {
    path: "/system", 
    component: ()=>import('@layout/index.vue'),
    children:[
      {
        path:'/system/role',
        component:()=>import('@views/system/role/index.vue')
      }
    ]
  }
]