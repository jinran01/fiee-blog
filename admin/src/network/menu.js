import {request} from "@/network/request";

//获取菜单
export function getMenuList() {
    return request({
        url:"/admin/menus"
    })
}

//通过角色id获取菜单
export function getMenusById(id) {
    return request({
        url:`/admin/role/menus/${id}`,
    })
}



