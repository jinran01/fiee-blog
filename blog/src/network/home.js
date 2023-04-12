import {request} from "@/network/request";

export function getHomeInfo(){
  return request({
    url:'/'
  })
}
