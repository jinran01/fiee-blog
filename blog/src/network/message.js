import {request} from "@/network/request";

//查看留言
export function getMessage(){
  return request({
    url:'/messages',
  })
}

//留言
export function addMessage(data){
  return request({
    url:'/messages',
    method:'POST',
    data
  })
}
