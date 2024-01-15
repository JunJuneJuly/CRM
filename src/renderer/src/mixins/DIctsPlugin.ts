import {App,ref} from 'vue'
import {queryBetch,Dicts} from '@api/dicts'
export default function useDicts(app:App){
  const dicts = ref<Partial<Dicts>>({})
  //请求获取字典
  async function getDicts(params:string[]) {
    let res = await queryBetch(params)
    dicts.value = res.data
  }
  app.mixin({
    data(){
      return{
        dicts,
      }
    },
    methods:{
      run(){
        console.log('run')
      },
      getDicts
    }
  })
}