import {createRouter, createWebHistory} from 'vue-router'
import {generaMenu} from "@/assets/js/menu";
import store from "@/store";

const Login = () => import("../views/login/Login")
const Layout = () => import("@/layout/Layout")
const notFound = () => import("@/views/404")
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
  },
  // {
  //   path: '/404',
  //   hidden: true,
  //   component: notFound,
  // },
  // {
  //   path: '/:pathMatch(.*)',
  //   redirect: '/404',
  //   hidden: true,
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {

  if (to.path == '/login'){
    next()
  }
  if (store.state.isLogin){
    if (store.state.menuList.length == 0) {
      store.state.menuList = JSON.parse(localStorage.getItem('menuList'))
      generaMenu();
      next({ ...to, replace: true })
    } else {
      next();
    }
  }else {
    next('/login')
  }
})
export default router
