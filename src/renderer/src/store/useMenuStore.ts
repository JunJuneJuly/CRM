import { defineStore } from 'pinia'
import { personalGetRouters } from '@api/user'
import {useUserStore} from '@store/useUserStore'

export const useMenuStore = defineStore('menuStore', {
  state: () => {
    return {
      menu:[],
    }
  },
  getters: {},
  actions: {
    async getMenu(){
      console.log(useUserStore().rolePerm)
      let res = await personalGetRouters(useUserStore().rolePerm)
      if(res.code == '200'){
        this.menu = res.data
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,//表示存储在localStorage
        paths:['menu']
      }
    ]
  }
})