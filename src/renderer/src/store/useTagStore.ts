import { defineStore } from 'pinia'
import { ITagRoute } from '@interface/tag'

export const useTagStore = defineStore('useTagStore', {
  state: ():{
    viewTags:ITagRoute[]
  } => {
    return {
      viewTags:[],
    }
  },
  getters: {},
  actions: {
    //添加
    pushViewTag(route:ITagRoute){
      let target = this.viewTags.find(item=>item.path == route.path)
      if(!target){
        this.viewTags.push(route)
      }
    },
    //删除
    deleteViewTag(route:ITagRoute){
      let index = this.viewTags.findIndex(item=>item.path == route.path)
      if(index != -1){
        this.viewTags.splice(index,1)
      }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,//表示存储在localStorage
        paths:['viewTags']
      }
    ]
  }
})