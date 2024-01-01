import {useMenuStore} from '@store/useMenuStore'
import router from '@router'
import clone from 'rfdc'
import {Parent} from '@interface/user'

export const beforeEach = (to:any,from,next)=>{
  console.log(to)
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
  //当前路由没有匹配到任何路由记录
  if(to.matched.length == 0){
    router.push(to.fullPath)
    return
  }
  next()
  return
}

interface Child {
  parentView: string;
  path: string;
  name: string;
  meta: any;
  redirect: string;
  children?: Child[] | null;
  component: any;
  id?: string | undefined;
  hidden?: boolean | undefined;
  alwaysShow?: boolean | undefined;
  query?: string | undefined;
}

//1.动态添加路由
const initRouter = () => {
  //该用户可获取路由
  let menu:Parent[] = useMenuStore().menu;
  //重新整理路由信息
  let menuRouter:Child[] = filterRouter(menu)
  let routes = flatRoutes(menuRouter)
  routes.forEach((item:any)=>{
    router.addRoute(item.parentView == 'layout' ? 'layout':'',item)
  })
}


//2.整理路由信息 .charAt(0) == '/' ? menu.path : `/${menu.path}`,
const filterRouter = (menuList:Parent[]):Child[] => {
  let resRouter:Child[] = []
  menuList.forEach((menu:any)=>{
    let item : Child = {
      parentView: menu.parentView,
      path: menu.path.charAt(0) == '/' ? menu.path : `/${menu.path}`,
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
const loadComponent = (component:string|null):(()=>Promise<any>) | undefined =>{
  if(component){
    return components[component]
  }
  return
}

//路由扁平化
const flatRoutes = (routes,breadcrumb=[]) => {
  let resRoutes = []
  const cloneRoutes = clone()(routes)
  cloneRoutes.forEach((route)=>{
    // debugger;
    if(route.children){
      let childBreadcrumb = [...breadcrumb]
      childBreadcrumb.push(route);
      //删除路由的children属性，并存入resRoutes
      let tempRoute = {...route}
      tempRoute.meta.children = childBreadcrumb;
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
