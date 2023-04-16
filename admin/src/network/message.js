import {request} from "@/network/request";

//获取留言列表
export function getMessages(data) {
  return request({
    url:'admin/messages',
    params:data
  })
}

//删除留言
export function delMessages(ids) {
  return request({
    url:'admin/messages',
    method:'DELETE',
    data:ids
  })
}

//审核留言
export function reviewMessages(ids) {
  return request({
    url:'admin/messages/review',
    method:'PUT',
    data:ids
  })
}
