import { defineStore } from 'pinia'
import {useUserStore} from './useUserStore.ts'

export const useStore = defineStore('storeId', {
  state: () => {
    return {
      user:useUserStore()
    }
  },
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,//表示存储在localStorage
        paths:[]
      }
    ]
  }
})