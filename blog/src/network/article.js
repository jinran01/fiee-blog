import {request} from "@/network/request";

export function getArticles() {
  return request({
    url:'/articles'
  })
}
