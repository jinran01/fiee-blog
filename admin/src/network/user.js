import {request} from "@/network/request";

//获取用户列表
export function getUserList(data) {
    return request({
        url:"/admin/users",
        params: data
    })
}
//获取在线用户
export function getOnlineUserList(data){
    return request({
        url:"/admin/users/online",
        params: data
    })
}

//修改用户状态
export function updateStatus(data) {
    return request({
        url:"/admin/users/disable",
        method:"PUT",
        data
    })
}

//修改用户角色
export function updateUserRole(data) {
    return request({
        url:"/admin/user/role",
        method:"PUT",
        data
    })
}
//下线用户
export function removeUser(userInfoId) {
    return request({
        url:`admin/users/${userInfoId}/online`,
        method:"DELETE",
        param:userInfoId
    })
}
