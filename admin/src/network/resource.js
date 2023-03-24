import {request} from "@/network/request";

//获取全部资源
export function getResource(resourceName) {
  return request({
    url:`admin/resources?resourceName=${resourceName}`
  })
}

//查资源
// export function searchResource(resourceName) {
//   return request({
//     url:`admin/resource?resourceName=${resourceName}`,
//
//   })
// }

//更新或修改资源
export function updateResources(resource) {
  return request({
    url:`admin/resources`,
    method:'POST',
    data:resource
  })
}

//删除
export function delResources(id) {
  return request({
    url:`admin/resources/${id}`,
    method:'DELETE',
  })
}
