import { defineStore } from 'pinia'
import { personalGetInfo } from '@api/user'

export const useUserStore = defineStore('useStore', {
  state: () => {
    return {
      roles: [],
      rolePerm:'',
      userInfo:{},
    }
  },
  getters: {},
  actions: {
    async getUser(){
      let res = await personalGetInfo()
      if(res.code == '200'){
        this.roles = res.data.roles
        this.rolePerm = this.roles[0].rolePerm
        this.userInfo = res.data.userInfo
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,//表示存储在localStorage
        paths:['rolePerm','userInfo']
      }
    ]
  }
})