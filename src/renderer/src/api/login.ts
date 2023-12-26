import http from '@utils/request'
import { RuleForm,UsernameResult,phoneRuleForm } from '@interface/login.ts'

//图形验证码 /captcha/image
export const captchaImage = (data:{key:string}):Promise<ArrayBuffer> => {
  return http.get<ArrayBuffer>('/captcha/image',data,{responseType:'arraybuffer'})
}
//账号密码登录
export const uLoginByJson = (data:RuleForm):Promise<UsernameResult> => {
  return http.post<UsernameResult>('/u/loginByJson',data)
}

//手机验证码登录
export const loginByMobile = (data:phoneRuleForm):Promise<UsernameResult> =>{
  return http.post<UsernameResult>('/u/loginByMobile',data)
}

//获取手机验证码
export const getPhoneCaptcha = (params:{mobile:string}):Promise<UsernameResult> => {
  return http.get<UsernameResult>('/captcha/sendFindPasswordCaptcha',params,{})
}
