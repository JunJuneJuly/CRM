import http from '@utils/request'
import { getInfoResult,getMenuResult } from '@interface/user.ts'
//个人信息
export const personalGetInfo = ():Promise<getInfoResult> => {
  return http.get<getInfoResult>('/personal/getInfo')
}
//获取路由
export const personalGetRouters = (rolePerm:string):Promise<getMenuResult> => {
  return http.get<getMenuResult>(`/personal/getRouters/${rolePerm}`)
}