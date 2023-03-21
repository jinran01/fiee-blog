import {createRouter, createWebHistory} from 'vue-router'
import {generaMenu} from "@/assets/js/menu";
import store from "@/store";

const Login = () => import("../views/login/Login")
const Layout = () => import("@/layout/Layout")

const routes = [
  {
    path: '/login/:url*',
    name: "Login",
    component: Login,
  },
  {
    path: "/admin",
    name: "Home",
    redirect:'/',
    component: Layout,
  }
  //     children: [
  //         {
  //             path: "/",
  //             name: "首页",
  //             component: Index,
  //         },
  //         {
  //             path: "/menus",
  //             name: "菜单列表",
  //             component: Menu,
  //         },
  //         {
  //             path: "/users",
  //             name: "用户列表",
  //             component: User,
  //         },
  //         {
  //             path: "/online/users",
  //             name: "在线列表",
  //             component: OnlineUser,
  //         }
  //     ]
  // },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (localStorage.getItem('userInfo')){
    if (store.state.menuList.length == 0) {
      store.state.menuList = JSON.parse(localStorage.getItem('menuList'))
      generaMenu();
      next({ ...to, replace: true })
    } else {
      next();
    }
  }else {
    next()
  }

})
export default router
