import {request} from "@/network/request";

//获取页面列表
export function getPages() {
  return request({
    url:`admin/pages`,
  })
}
//保存或更新页面
export function saveOrUpdatePage(data) {
  return request({
    url:`admin/pages`,
    method:'POST',
    data
  })
}
//删除页面
export function delPage(id) {
  return request({
    url:`admin/pages/${id}`,
    method:'DELETE',
  })
}

//获取ossToken
export function getPageOssToken() {
  return request({
    url:`admin/pages/getOssToken`,

  })
}
