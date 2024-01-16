import http from '@utils/request'

interface Irole{
  current:number,
  size:number,
  roleName?:string,
  rolePerm?:string,
  enabled?:string
}
export interface IroleApiResponse{
  code: string;  
  msg: string;  
  data: {
    records: Role[];  
    total: number;  
    size: number;  
    current: number;  
    orders: any[]; // 由于 orders 的具体内容未给出，所以使用 any 类型  
    optimizeCountSql: boolean;  
    searchCount: boolean;  
    countId: string | null; // 由于 countId 的具体内容未给出，所以使用 any 类型  
    maxLimit: number | null; // 由于 maxLimit 的具体内容未给出，所以使用 any 类型  
    pages: number;  
  };  
}
export interface Role{
  id: string; // 角色ID  
  roleName: string; // 角色名称  
  rolePerm: string; // 角色权限字符  
  unitId: string; // 机构ID  
  dataPrivileges: number; // 数据权限  
  enabled: string; // 是否启用（0：禁用；1：启用）  
  createBy: string | null; // 创建者，可以为空  
  createTime: number; // 创建时间，以毫秒为单位的时间戳  
  updateBy: string | null; // 更新者，可以为空  
  updateTime: number | null; // 更新时间，以毫秒为单位的时间戳，可以为空  
  descript: string | undefined; // 描述，可以为空  
}
// rolePage
//角色列表
export const rolePage = (data:Irole):Promise<IroleApiResponse> => {
  return http.get<IroleApiResponse>('/system/role/page',data)
}
export interface IroleAdd{
  code:string;
  msg:string;
  data:null;
}
interface IroleUpdate{
  code:string;
  msg:string;
  data:{
    role:Role;
    permissions:string[];
  };
}
export interface IroleData{
  roleName: string;//角色名称
  rolePerm: string;//角色权限编码
  enabled: string;//是否启用（0：禁用；1：启用）
  descript: string|undefined;//描述
  permissionIds: string[];
  id?:string;
}
//添加角色
export const roleAdd = (data:IroleData):Promise<IroleAdd> => {
  return http.post<IroleAdd>('/system/role/add',data)
}
//删除角色
export const roleDelete = (data:string):Promise<IroleAdd> => {
  return http.get<IroleAdd>(`/system/role/delete/${data}`)
}
//获取角色详情 
export const roleGet = (data:string):Promise<IroleUpdate> => {
  return http.get<IroleUpdate>(`/system/role/get/${data}`)
}
//修改角色
export const roleUpdate = (data:IroleData):Promise<IroleAdd> => {
  return http.post<IroleAdd>(`/system/role/update`,data)
}
//菜单树
export interface IRoleMenuItem{
  id: string;//菜单ID
  name: string;//菜单权限名称
  parentId: string;//上级ID
  sort: number;//排序
  path: string;//路由地址
  query: string | null,//路由参数
  component: string;//组件路径
  cache: number;//是否缓存（0：缓存；1：不缓存）
  type: number;//菜单类型（0：目录；1：菜单；2：按钮）
  visible: number;//显示状态（0：显示；1：隐藏）
  redirect: string;//重定向
  enabled: number;//菜单状态（0：禁用；1：启用）
  perms: string;//权限标识
  icon: string;//图标 
  remark: string | null;//备注
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  children?:IRoleMenuItem[];
}
interface IRole{
  code: string;
  msg: string;
  data: IRoleMenuItem[];
}
//获取菜单权限树
export const menuTree = ():Promise<IRole> => {
  return http.get<IRole>('/system/menu/tree')
}