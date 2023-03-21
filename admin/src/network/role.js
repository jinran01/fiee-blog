import {request} from "@/network/request";
//获取角色
export function getRoles(data){
  return request({
    url:'admin/roles',
    params: data
  })
}

// 禁用or开启角色
export function roleStatus(data){
  return request({
    url:'admin/role',
    method:'PUT',
    data
  })
}
// 删除角色
export function delRoles(data){
  return request({
    url:'admin/roles',
    method:'DELETE',
    data
  })
}

