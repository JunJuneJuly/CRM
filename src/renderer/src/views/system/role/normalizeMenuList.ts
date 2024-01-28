import {IRoleMenuItem} from '@api/role'
const normalizeMenuList = (list:IRoleMenuItem[],cb:(menu:IRoleMenuItem)=>void =()=>null):IRoleMenuItem[] => {
  const menuMap = new Map(list.map(item=>[item.id,item]))
  const result:IRoleMenuItem[] = [];
  // 递归处理
  list.forEach((menu:IRoleMenuItem)=>{
    cb(menu);
    if(menu.parentId == '-1'){
      return result.push(menu)
    }
    const parent = menuMap.get(menu.parentId);
    parent && parent.children?.push(menu);
    return;
  })
  //排序
  sortMenuList(result);
  return list
}
function sortMenuList(list:IRoleMenuItem[]){
  list.sort((a,b)=>a.sort - b.sort );
  list.forEach((item:IRoleMenuItem)=>{
    if(Array.isArray(item.children) && item.children.length > 1){
      sortMenuList( item.children );
    }
  })
}


export default normalizeMenuList;