<template>
  <v-navigation-drawer
      app
      temporary
      style="top: 0;height: auto"
      v-model="drawer"
      location="left"
      overlay-opacity="0.8"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          瑾然灬
        </v-list-item-title>
        <v-list-item-subtitle>
          瑾然灬
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
  </v-navigation-drawer>
</template>

<script>
import store from "@/store";
import router from "@/router";
import {computed} from "vue";

export default {
  setup() {
    let blogInfo = store.state.blogInfo
    const drawer = computed(() => {
      return store.state.drawer
    })
    return {
      drawer,
      blogInfo,
    }
  },
  computed: {
    isLogin() {
      return this.$store.state.userId;
    }
  },
  // methods: {
  //   openLogin() {
  //     store.state.loginFlag = true;
  //   },
  //   logout() {
  //     //如果在个人中心则跳回上一页
  //     if (route.path == "/user") {
  //       router.go(-1);
  //     }
  //     this.axios.get("/api/logout").then(({ data }) => {
  //       if (data.flag) {
  //         store.commit("logout");
  //         toast({ type: "success", message: "注销成功" });
  //       } else {
  //         toast({ type: "error", message: data.message });
  //       }
  //     });
  //   }
  // }
};
</script>

<style scoped lang="less">
//.blogger-info {
//  padding: 26px 30px 0;
//  text-align: center;
//}
//
//.blog-info-wrapper {
//  display: flex;
//  align-items: center;
//  padding: 12px 10px 0;
//}
//
//.blog-info-data {
//  flex: 1;
//  line-height: 2;
//  text-align: center;
//}
//
//hr {
//  border: 2px dashed #d2ebfd;
//  margin: 20px 0;
//}
//
//.menu-container {
//  padding: 0 10px 40px;
//  animation: 0.8s ease 0s 1 normal none running sidebarItem;
//}
//
//.menus-item a {
//  padding: 6px 30px;
//  display: block;
//  line-height: 2;
//}
//
//.menus-item i {
//  margin-right: 2rem;
//}
//
//@keyframes sidebarItem {
//  0% {
//    transform: translateX(200px);
//  }
//  100% {
//    transform: translateX(0);
//  }
//}
</style>

