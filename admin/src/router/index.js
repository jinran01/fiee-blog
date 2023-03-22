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
    redirect: {name:'首页'},
    component: Layout,

  },
  {
    path:'/404',
    hidden: true,
    component:notFound,
  },
  // {
  //   path: '/:url*',
  //   redirect: '/404',
  //   hidden: true
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {

  // console.log(to.matched)
  // if (to.matched.length == 0){
  //   next('/404')
  // }
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
