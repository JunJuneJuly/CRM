import http from '@utils/request'

export interface userInfo {  
  username?: string; // 用户名  
  password?: string; // 密码  
  realName?: string; // 真实姓名  
  email?: string | null; // 邮箱  
  gender?: string; // 用户性别（1：男；2：女；0：未知）  
  avatar?: string | null; // 头像  
  remark?: string | null; // 备注  
  phone?: string; // 手机号  
  enabled?: string; // 帐号状态（0：禁用；1：正常）  
  roleIds?: string[]; // 角色  
  postIds?: string[]; // 岗位  
  unitId?: string; // 机构ID  
}

export interface userParams {  
  current: string; // 当前页  
  size: string; // 分页大小  
  username?: string; // 登录账号  
  realName?: string; // 真实姓名  
  email?: string; // 用户邮箱  
  phone?: string; // 手机号码  
  gender?: string; // 用户性别（1：男；2：女；0：未知）  
  enabled?: string; // 帐号状态（0：禁用；1：正常）  
  unitId?: string; // 机构ID  
}

interface ResponseData {  
  records: Record[];  
  total: number;  
  size: number;  
  current: number;  
  orders: any[]; // 由于 orders 的具体内容未知，这里我们假设它是一个任意类型的数组  
  optimizeCountSql: boolean;  
  searchCount: boolean;  
  countId: any; // 由于 countId 的具体内容未知，这里我们假设它是任意类型  
  maxLimit: any; // 由于 maxLimit 的具体内容未知，这里我们假设它是任意类型  
  pages: number;  
}  

export interface Record {  
  id: string;  
  username: string; // 用户名  
  realName: string; // 真实姓名  
  userType: number; // 用户类型（0：普通账号；1：超级管理员）  
  email: string; // 用户邮箱  
  phone: string; // 手机号码  
  gender: number; // 用户性别（1：男；2：女；0：未知）  
  avatar: string; // 头像路径  
  enabled: number; // 帐号状态（0：禁用；1：正常）  
  delFlag: number; // 是否删除（0：有效；1：删除）  
  loginIp: string; // 最后登陆IP  
  loginDate: number; // 最后登陆时间  
  createBy: any; // 由于 createBy 的具体内容未知，这里我们假设它是任意类型  
  createTime: number; // 创建时间  
  updateBy: string; // 更新者ID  
  updateTime: number; // 更新时间  
  remark: any; // 备注，由于具体内容未知，这里我们假设它是任意类型  
}  

interface userResult {  
  code: string;  
  msg: string;  
  data: ResponseData;  
}
interface userResponese {  
  code: string;  
  msg: string;  
  data: null;  
}

//获取用户列表
export const userPage = (data:userParams):Promise<userResult> => {
  return http.get<userResult>(`/system/user/page/`,data)
}
//添加用户
export const userAdd = (data:userInfo):Promise<userResponese> => {
  return http.post<userResponese>(`/system/user/add`,data)
}
interface IuserData{
  id:string;
  username:string;
  realName:string;
  userType:string;
  email:string;
  phone:string;
  gender:string;
  avatar:string;
  enabled:string;
  delFlag:string;
  loginIp:number;
  loginDate:number;
  createBy:string;
  createTime:number;
  updateBy:string;
  updateTime:number;
  remark:string | null;
}
interface IUserGetData{
  code:string;
  msg:string;
  data:{
      roleIds:string[];
      postIds:string[];
      user:IuserData;
  }
}
//查询角色
export const userGet = (id:string)=>{
  return http.get<IUserGetData>(`/system/user/get/${id}`)
}
//删除用户
export const userDelete = (id:string):Promise<deleUser> => {
  return http.get<deleUser>(`/system/user/delete/${id}`)
}
interface IUpdate extends userInfo{
  id?:string;
}
//修改用户
export const userUpdate = (data:IUpdate):Promise<deleUser> => {
  return http.post<deleUser>(`/system/user/update`,data)
}

interface unitListRes{
  code: string;  
  msg: string;  
  data:unit[];
}
export interface unit{
  id: string; // 机构ID  
  name: string; // 机构名称  
  code: string; // 机构编码  
  codeseq: string; // 机构层级  
  contact: string; // 联系人  
  mobile: string; // 联系人手机  
  email: string; // 联系人邮箱  
  web: string; // 网址  
  parentId: string; // 上级机构ID  
  hasChildren: number; // 是否有孩子  
  system: number; // 是否为系统内置（1：是；0：否）  
  enabled: number; // 是否启用（1：启用；0：禁用）  
  leaderId: any; // 领导用户ID  
  createBy: string;  
  createTime: number;  
  updateBy: any;  
  updateTime: any;  
  address: string; // 地址  
}

//机构列表
export const unitList = ():Promise<unitListRes> => {
  return http.get<unitListRes>(`/system/unit/list`)
}

interface postListRes {  
  code: string;  
  msg: string;  
  data: {  
    records: post[];  
    total: number; // 总记录数  
    size: number; // 每页记录数  
    current: number; // 当前页数  
    orders: Array<any>; // 排序条件  
    optimizeCountSql: boolean; // 是否优化count sql语句  
    searchCount: boolean; // 是否需要搜索记录数  
    countId: string | null; // 搜索记录数时用到的id  
    maxLimit: string | null; // 分页时最大记录数限制  
    pages: number; // 总页数  
  };  
}
export interface post{
  id: string; // 岗位ID  
  postName: string; // 岗位名称  
  postCode: string; // 岗位编码  
  sort: number; // 排序  
  enabled: number; // 是否启用（1：启用；0：禁用）  
  remark: string | null; // 备注  
  createBy: string | null;  
  createTime: string | null;  
  updateBy: string | null;  
  updateTime: string | null;  
}
//岗位列表
export const postList = ():Promise<postListRes> => {
  return http.get<postListRes>(`/system/post/page`)
}
interface roleListRes {  
  code: string;  
  msg: string;  
  data: {  
    records: role[];  
    total: number; // 总记录数  
    size: number; // 每页记录数  
    current: number; // 当前页数  
    orders: Array<any>; // 排序条件  
    optimizeCountSql: boolean; // 是否优化count sql语句  
    searchCount: boolean; // 是否需要搜索记录数  
    countId: string | null; // 搜索记录数时用到的id  
    maxLimit: string | null; // 分页时最大记录数限制  
    pages: number; // 总页数  
  };  
}
export interface role{
  id: string; // 角色ID  
  roleName: string; // 角色名称  
  rolePerm: string; // 角色权限字符  
  unitId: string; // 机构ID  
  dataPrivileges: number; // 数据权限  
  enabled: number; // 是否启用（0：禁用；1：启用）  
  createBy: string | null;  
  createTime: number;  
  updateBy: string | null;  
  updateTime: string | null;  
  descript: string | null; // 描述  
}
//角色列表
export const roleList = ():Promise<roleListRes> => {
  return http.get<roleListRes>(`/system/role/page`)
}

interface deleUser{
  code:string;
  data:null;
  msg:string;
}
//删除角色
export const roleDelete = (id:string):Promise<deleUser> => {
  return http.get<deleUser>(`/system/role/delete/${id}`)
}
