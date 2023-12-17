import request from '@utils/request'
import { RuleForm,UsernameResult,phoneRuleForm } from '@interface/login.ts'

//图形验证码 /captcha/image
export const captchaImage = (params:{key:string}):Promise<ArrayBuffer> =>{
  return request({
    url:'/captcha/image',
    methods:'get',
    responseType:'arraybuffer',
    params
  })
}
//账号密码登录
export const uLoginByJson = (data:RuleForm):Promise<UsernameResult> =>{
  return request({
    url:'/u/loginByJson',
    methods:'post',
    data
  })
}
//手机验证码登录
export const loginByMobile = (data:phoneRuleForm):Promise<UsernameResult> =>{
  return request({
    url:'/u/loginByMobile',
    methods:'post',
    data
  })
}
//获取手机验证码

export const getPhoneCaptcha = (params:{mobile:string}):Promise<UsernameResult> =>{
  return request({
    url:'/captcha/sendFindPasswordCaptcha',
    methods:'get',
    params
  })
}