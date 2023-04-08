import {request} from "@/network/request";

//获取友链列表
export function getFriendLinks(data) {
  return request({
    url: "/links",
    params: data
  })
}

//更新或者保存友链
export function addOrUpdateLinks(data) {
  return request({
    url: "/links",
    method: 'POST',
    data
  })
}

//删除友链
export function delFriendLinks(ids) {
  return request({
    url: `/links`,
    method:'DELETE',
    data:ids
  })
}
