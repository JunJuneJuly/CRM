export interface RuleForm  {
  username: string
  password: string
  captcha: string
  key: string
}
export interface phoneRuleForm  {
  mobile: string
  captcha: string
}
export interface UsernameResult{
  code:string,
  data?:string,
  msg:string
}
