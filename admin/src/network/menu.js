import {request} from "@/network/request";

//获取菜单
export function getMenuList(menuName) {
    return request({
        url:`/admin/menus?menuName=${menuName}`
    })
}

//更新或新增菜单
export function updateMenu(menu) {
    return request({
        url:`/admin/menus`,
        method:'POST',
        data:menu
    })
}
//删除菜单
export function delMenu(id) {
    return request({
        url:`/admin/menus/${id}`,
        method:'DELETE'
    })
}


