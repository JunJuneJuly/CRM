import {useUserStore} from '@store/useUserStore'

export const AuthDirective = {
  name:'auths',
  mounted(el:any,binding:any) {
    let permissions= useUserStore().permissions;
    // 判断用户权限是否包含该权限
    if(permissions.includes("*:*:*")) return
    if(!permissions.includes(binding.value)){
      const parent = el.parentElement;
      parent && parent.removeChild(el);
    }
  },
}