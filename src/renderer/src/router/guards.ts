export const beforeEach = (to,from,next)=>{
  console.log(to)
  if(to.path === '/login'){
    next()
    return
  }
  const token = localStorage.getItem('TOKEN') || '';
  console.log(token)
  if(token){
    next()
  }else{
    next({
      path:'/login'
    })
  }
}
export const afterEach = () => {
  console.log('后置')
}
