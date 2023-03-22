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

// 添加角色
export function addRoles(data){
  return request({
    url:'admin/role',
    method:'POST',
    data
  })
}

// 更新角色菜单
export function updateMenus(data){
  return request({
    url:'admin/role/menus',
    method:'POST',
    data
  })
}

// 更新角色资源
export function updateResources(data){
  return request({
    url:'admin/role/resources',
    method:'POST',
    data
  })
}

