import {request} from "@/network/request";

export function login(form) {
    return request({
        url:"/login",
        method:"POST",
        params:form
    })
}
export function logout() {
    return request({
        url:"/logout",
        method:"POST",
    })
}
