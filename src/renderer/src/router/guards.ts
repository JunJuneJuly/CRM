import {useMenuStore} from '@store/useMenuStore'
import router from '@router'

export const beforeEach = (to,from,next)=>{
  if(to.path === '/login'){
    next()
    return
  }
  const token = localStorage.getItem('TOKEN') || '';
  if(!token){
    next({
      path:'/login'
    })
    return
  }
  //动态添加路由
  initRouter()
  next()
  return
}

//1.动态添加路由
const initRouter = () => {
  //该用户可获取路由
  let menu = useMenuStore().menu;
  //重新整理路由信息
  let menuRouter = filterRouter(menu)
  let routes = flatRoutes(menuRouter)
  routes.forEach((item)=>{
    router.addRoute(item.parentView == 'layout' ? 'layout':'',item)
  })
  console.log(router)
}

//2.整理路由信息 .charAt(0) == '/' ? menu.path : `/${menu.path}`,
const filterRouter = (menuList) => {
  let resRouter = []
  menuList.forEach((menu)=>{
    let item = {
      parentView: menu.parentView,
      path: menu.path,
      name: menu.name,
      meta: menu.meta,
      redirect: menu.redirect,
      children:menu.children ? filterRouter(menu.children) : null,
      component:loadComponent(menu.component)
    }
    resRouter.push(item)
  })
  return resRouter
}


export const afterEach = () => {
  console.log('后置')
}
// 3.改变component的值
const modules = import.meta.glob('@renderer/views/**/*.vue')
let components = {}
Object.keys(modules).forEach((key)=>{
  const componentName = key.replace('/src/views/','').replace('.vue','').replace('/index','')
  //?
  if (key.includes('index')) {
    components[`${componentName}/index`] = modules[key]
  }
  components[componentName] = modules[key]
})
const loadComponent = (component)=>{
  if(component){
    return components[component]
  }
  return
}

//路由扁平化
const flatRoutes = (routes,breadcrumb=[]) => {
  let resRoutes = []
  routes.forEach((route)=>{
    if(route.children){
      let childBreadcrumb = [...breadcrumb]
      childBreadcrumb.push(route);
      //删除路由的children属性，并存入resRoutes
      let tempRoute = {...route}
      delete tempRoute.children
      resRoutes.push(tempRoute)
      let childrenRoutes = flatRoutes(route.children,childBreadcrumb)
      childrenRoutes.map((item)=>{
        resRoutes.push(item)
      })

      
    }else{
      let tmpBreadcrumb = [...breadcrumb]
      route.meta.breadcrumb = tmpBreadcrumb
      tmpBreadcrumb.push(route)
      resRoutes.push(route)
    }
  })
  return resRoutes
}

export const fu = () => {
  console.log('11')
}