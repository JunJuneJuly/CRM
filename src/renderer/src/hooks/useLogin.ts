import { useUserStore } from '@store/useUserStore.ts';
import { useMenuStore } from '@store/useMenuStore.ts';
import router from '@router'



const useLogin = async(res) => {
  localStorage.setItem('TOKEN', res.data || '')
  //获取个人信息
  await useUserStore().getUser();
  // 获取路由
  await useMenuStore().getMenu()
  //跳转路由
  router.push('/')
}
export default useLogin