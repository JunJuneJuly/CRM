export interface getMenuResult{
  code:string,
  data:[],
  msg:string
}

export interface getInfoResult{
  code:string,
  data:{
    userInfo:userInfo,
    permissions:[],
    units:units,
    roles:[]
  },
  msg:string
}
export interface userInfo{
  id: string,
  username: string, //用户名
  realName: string, //真实姓名
  userType: number,  //用户类型（0：普通账号；1：超级管理员）
  email: string, //用户邮箱
  phone: string, //手机号码
  gender: number, //用户性别（1：男；2：女；0：未知）
  avatar: string, //头像路径
  enabled: number, //帐号状态（0：禁用；1：正常
  delFlag: number, //是否删除（0：有效；1：删除）
  remark: null | string, //备注
}
export interface units{
  id: string,//机构ID
  name: string,//机构名称
  code: string,//机构编码
  codeseq: string,//机构层级
  contact: string,//联系人
  mobile: string,//联系人手机
  email: string,//联系人邮箱
  web: string,//网址
  parentId: string,//上级机构ID
  hasChildren: number,//是否有孩子
  system: number,//是否为系统内置（1：是；0：否）
  enabled: number,//是否启用（1：启用；0：禁用）
  leaderId: null | string,//领导用户ID
  createBy: string,
  createTime: number,
  updateBy: null | string,
  updateTime: null | string,
  address: string//地址
}

export interface Meta {
  title: string;
  icon: string;
  noCache: boolean;
  link: string | null;
}
export interface Child {
  id: string;
  name: string;
  path: string;
  hidden: boolean;
  component: string;
  meta: Meta;
}
export interface Parent {
  id?: string;
  name?: string;
  hidden?: boolean;
  redirect?: string;
  component?: string;
  alwaysShow?: boolean;
  query?: string;
  path?: string;
  meta?: Meta;
  children?: Child[];
}
