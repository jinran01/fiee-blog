import {request} from "@/network/request";

export function getResource() {
  return request({
    url:'admin/resources'
  })
}
