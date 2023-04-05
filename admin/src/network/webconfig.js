import {request} from "@/network/request";

//获取网站配置信息
export function getWebConfig() {
  return request({
    url:"/admin/website/config",
  })
}
//更新网站配置信息
export function updateWebConfig(data) {
  return request({
    url:"/admin/website/config",
    method:'POST',
    data
  })
}

//获取configOssToken
export function getConfigOssToken() {
  return request({
    url:`admin/getConfigOssToken`,
  })
}
