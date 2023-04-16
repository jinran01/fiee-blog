<template>
  <v-app>
    <!-- 导航栏 -->
    <TopNavBar :blogInfo="blogInfo"></TopNavBar>
    <!-- 侧边导航栏 -->
    <SideNavBar />
    <v-main style="margin-bottom: 30px">
      <router-view :key="$route.fullPath"/>
    </v-main>
    <Footer ></Footer>
    <BackTop></BackTop>
  </v-app>
</template>

<script>

import Footer from "@/components/layout/Footer";
import TopNavBar from "@/components/layout/TopNavBar";
import BackTop from "@/components/BackTop";
import {onBeforeMount, onMounted, ref} from "vue";
import store from "@/store";
import {getHomeInfo} from "@/network/home";
import {clickEffect} from "@/common/js/onClick";
// import {snow} from "@/common/js/snow";
import {ElMessage} from "element-plus";
import SideNavBar from "@/components/layout/SideNavBar";

export default {

  name: 'App',
  components: {
    SideNavBar,
    Footer,
    TopNavBar,
    BackTop
  },
  setup(){
    let blogInfo = ref()
    onBeforeMount(()=>{
      getHomeInfo().then(res=>{
        if (res.flag){
          blogInfo.value = res.data
          store.commit("setBlogInfo",res.data)
          localStorage.setItem("blogInfo",JSON.stringify(res.data))
        }else {
          ElMessage({
            type:'error',
            message:'出错了'
          })
        }
      })
    })
    return{
      blogInfo,
    }
  }
}
</script>
<style scoped lang="less">
footer{
  width: 100%;
  padding: 0;
}
</style>
