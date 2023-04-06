import {request} from "@/network/request";

//获取页面列表
export function getPages() {
  return request({
    url:`admin/pages`,
  })
}
