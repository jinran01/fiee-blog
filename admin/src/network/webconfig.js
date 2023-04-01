import {request} from "@/network/request";

//获取网站配置信息
export function getWebConfig() {
  return request({
    url:"/admin/website/config",
  })
}
