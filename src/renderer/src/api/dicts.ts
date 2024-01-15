import http from '@utils/request'

type DictsItem = {
  id:string;
  typeId:string;
  k:string;
  v:string;
  sort:number;
  remark:string;
  createBy:string;
  createTime:number;
  updateBy:string | null;
  updateTime:number | null;
}

export type Dicts = {
  system_global_status:DictsItem[]
}

interface IDicts{
  code:string;
  msg:string;
  data:Dicts
}
export const queryBetch = (data:string[]) => {
  return http.post<IDicts>('/system/dict/item/queryBatch',data)
}