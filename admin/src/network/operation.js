import {request} from "@/network/request";

//获取操作日志
export function getOperations(data) {
  return request({
    url:`/admin/operation/logs`,
    method:'GET',
    params:data
  })
}
//获取操作日志
export function delOperations(ids) {
  return request({
    url:`/admin/operation/logs`,
    method:'DELETE',
    data:ids
  })
}
