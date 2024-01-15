import {Ref, ref} from 'vue'
interface useMemoPassWordResult{
  memoVal:Ref<boolean>,
  onMemoPassWord:(value:boolean)=>void
}

function useMemoPassWord():useMemoPassWordResult{
  //获取持久化存储的 memoPassWord
  const memoVal:Ref<boolean> = ref(localStorage.getItem('memoPassWord') == 'true')
  const onMemoPassWord = (value:boolean) => {
    localStorage.setItem('memoPassWord',(memoVal.value = value).toString())
    
  }
  return{
    memoVal,
    onMemoPassWord
  }
}
export default useMemoPassWord