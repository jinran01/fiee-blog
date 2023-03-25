
import router from "@/router";
import store from "@/store";

export function generaMenu() {
  const routerPackage = routers => {
    routers.map(item=>{
      router.addRoute('Home', {
        path: `${item.path}`,
        name: item.name,
        component: () => import(`@/views${item.component}`),//此处根据具体地址进行调整
      });
      if (item.children && item.children.length) {
        routerPackage(item.children);
      }
    })
  }
  routerPackage(store.state.menuList)
}

