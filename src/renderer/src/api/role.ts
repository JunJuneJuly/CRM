import http from '@utils/request'

interface Irole{
  current:string,
  size:string,
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
  enabled: number; // 是否启用（0：禁用；1：启用）  
  createBy: string | null; // 创建者，可以为空  
  createTime: number; // 创建时间，以毫秒为单位的时间戳  
  updateBy: string | null; // 更新者，可以为空  
  updateTime: number | null; // 更新时间，以毫秒为单位的时间戳，可以为空  
  descript: string | null; // 描述，可以为空  
}
// rolePage
//角色列表
export const rolePage = (data:Irole):Promise<IroleApiResponse> => {
  return http.get<IroleApiResponse>('/system/role/page',data)
}