import { rejects } from "assert";
import axios, { AxiosResponse } from "axios";
import { error } from "console";
import { resolve } from "path";


const request = axios.create({
  baseURL: '/api'
});
// 添加请求拦截器
request.interceptors.request.use(function (config) {
  const token = localStorage.getItem('TOKEN')
  if(token){
    config.headers.Authorization = token
  }
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
const http = {
  get<T>(url:string,params?:any,config?:{responseType?:string}):Promise<T>{
    return new Promise((resolve,reject)=>{
      request.get<T>(url,{params,...config}).then((response:AxiosResponse<T>)=>{
        //如果返回的是图形验证码，直接抛出数据；否则抛出data
        resolve(response)
        
      }).catch((error)=>{
        reject(error)
      })
    })
  },
  post<T>(url:string,data?:any,config?:{}):Promise<T>{
    return new Promise((resolve,reject)=>{
      request.post<T>(url,data,config).then((response:AxiosResponse<T>)=>{
        resolve(response)
      }).catch((error)=>{
        reject(error)
      })
    })
  }
}
export default http;

