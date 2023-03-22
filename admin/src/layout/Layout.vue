<template>
  <div class="common-layout">
    <el-container direction="horizontal">
      <el-aside :style="getBodyWidth < 667 &&  isCollapse ? {width:'0'} : {width:'auto'}">
        <el-scrollbar>
          <el-menu
              router
              default-active="/"
              class="el-menu-vertical-demo"
              :collapse="isCollapse"
              unique-opened
          >
            <h3 class="SideTitle">Fiee 管理系统</h3>
            <template v-for="(item) in menuList">
              <template v-if="item.children.length > 0 && item.isHidden == 0">
                <el-sub-menu :index="item.path">
                  <template #title>
                    <el-icon>
                      <i class="iconfont" :class="item.icon"></i>
                    </el-icon>
                    <span>{{ item.name }}</span>
                  </template>
                  <el-menu-item v-for="(i,index) in item.children" :index="i.path">
                    <template #title>
                      <el-icon>
                        <i class="iconfont" :class="i.icon"></i>
                      </el-icon>
                      <span>{{ i.name }}</span>
                    </template>
                  </el-menu-item>
                </el-sub-menu>
              </template>
              <template v-if="item.children.length == 0 && item.isHidden == 0 " >
                <el-menu-item :index="item.path">
                  <el-icon>
                    <i class="iconfont" :class="item.icon"></i>
                  </el-icon>
                  <span>{{ item.name }}</span>
                </el-menu-item>
              </template>
            </template>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-header>
          <el-page-header  style="margin-left: 15px">
            <template #title >
              {{ '' }}
            </template>
            <template #content>
              <el-breadcrumb separator=">" v-if="getBodyWidth >= 667">
                <el-breadcrumb-item v-for="(item,index) in routeList" :key="$route.fullPath" >
                  {{ item.name }}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </template>
            <template #extra>
              <div class="header_right">
                <el-icon size="27" style="margin-right: 20px" @click="doFullScreen"><FullScreen /></el-icon>
                <span class="welcome">晚上好！</span>
                <el-dropdown>
                  <el-avatar style="margin-right: 30px"
                             :src="userInfo.avatar"/>
                  <template #dropdown>
                    <el-dropdown-menu >
                      <el-dropdown-item >
                        <el-icon>
                          <Avatar/>
                        </el-icon>
                        个人中心
                      </el-dropdown-item >
                      <el-dropdown-item @click="doLogout">
                        <el-icon>
                          <SwitchButton/>
                        </el-icon>
                        退出登录
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
            <template #icon >
              <el-icon @click="doOpenOrClose" size="20px">
                <Expand v-if="isCollapse"/>
                <Fold v-if="!isCollapse"/>
              </el-icon>
            </template>
          </el-page-header>
          <div class="tabList">
            <el-tag class="tab"
                    :key="item.path"
                    :closable="item.path != '/'"
                    v-for="item in routeList"
                    effect="light"
                    round
                    @close="handleClose(item)"
                    :type=randomType()
                    @click="goTo(item)">
              {{ item.name }}
            </el-tag>
          </div>
        </el-header>
        <el-main>
          <div class="fade-transform-box">
            <router-view v-slot="{ Component }">
              <keep-alive>
                <transition name="el-zoom-in-top">
                  <component :is="Component"/>
                </transition>
              </keep-alive>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref, toRefs, watch} from "vue";
import {ArrowRight} from '@element-plus/icons-vue'
import User from "@/views/user/User";
import store from "@/store";
import router from "@/router";
import {logout} from "@/network/admin";
import {ElMessage} from "element-plus";
import screenfull from 'screenfull'
import {removeUser} from "@/network/user";

export default {
  name: "Layout",
  components: {
    User
  },
  setup() {
    let routeList = store.state.tabList
    let userInfo = ref({})
    let menuList = ref([])
    let isCollapse = ref(true)
    const doOpenOrClose = () => {
      isCollapse.value = isCollapse.value == true ? false : true
    }
    let state = reactive({
      bodyWidth: store.state.bodyWidth
    })
    onMounted(() => {
      menuList.value = store.state.menuList
      userInfo.value = store.state.userInfo
      // console.log(menuList.value)
    })
    //全屏模式
    const doFullScreen = () => {
      screenfull.toggle()
    }
    const getBodyWidth = computed(() => {
      window.addEventListener("resize", () => {
        state.bodyWidth = document.body.clientWidth
        store.state.bodyWidth = document.body.clientWidth
      })
      return state.bodyWidth;
    })

    // watch(getBodyWidth, () => {
    // })

    //随机获取标签颜色
    function randomType() {
      let type = ["", "success", "info", "danger", "warning"]
      let floor = Math.floor(Math.random() * 5);
      return type[floor]
    }

    const goTo = (item) => {
      router.push(item.path)
    }
    // function handleNodeClick(obj, a) {
    //   console.log(a.checkedKeys);
    //   console.log(obj)
    // }
    //关闭标签
    const handleClose = (tab) => {
      let index = store.state.tabList.findIndex(item => item.name === tab.name);
      store.commit("removeTab", index)
      //跳转到最后一个标签
      router.push(routeList[routeList.length - 1].path)
    }
    // const handleCheckChange = (data, checked, indeterminate) => {
    //   console.log(data, checked, indeterminate, data.getCheckedKeys)
    // }
    watch(() => router.currentRoute.value, (to, from) => {
      store.commit("addTab", {name: to.name, path: to.path})
    }, {immediate: true, deep: true})

    const defaultProps = {
      children: 'children',
      label: 'name',
    }
    //登出
    const doLogout = () => {
      logout().then(res => {
        if (res.flag) {
          removeUser(store.state.userInfo.userInfoId).then(result=>{
            //清除管理员信息
            localStorage.removeItem('userInfo')
            //清除菜单
            localStorage.removeItem('menuList')
            //reset Tabs
            store.commit('resetTab')
            if (result.code == 51000){
              ElMessage({
                message: '成功退出',
                type: 'success',
              })
              router.push('/login')
            }
          })
        }
      })
    }
    return {
      doFullScreen,
      getBodyWidth,
      ...toRefs(state),
      doOpenOrClose,
      menuList,
      isCollapse,
      ArrowRight,
      routeList,
      defaultProps,
      userInfo,
      // handleNodeClick,
      // handleCheckChange,
      // isCached,
      randomType,
      goTo,
      handleClose,
      doLogout,
    }
  },
}
</script>

<style scoped lang="less">
.common-layout {
  height: 100%;
  display: flex;

  .el-header {
    height: auto;
    padding: 0;
    .el-page-header {
      border-bottom: rgba(230, 230, 230, 0.8) solid 1px;
      .el-divider{
        border-left: none;
        margin: 0;
      }
    }

    border-bottom: rgba(230, 230, 230, 0.8) solid 1px;

    .tabList {
      box-shadow: 1px 1px 3px 4px rgba(230, 230, 230, 0.9), 0 0 2px 0 rgba(230, 230, 230, 0.1);
      font-weight: bold;
      display: flex;
      overflow: hidden;
      padding: 2px 0 2px 0;
      .tab:first-child{
        margin-left: 15px;
      }
      .tab{
        margin-left: 5px;
      }
    }
  }

  .el-main {
    height: 100%;
    background-color: rgba(255, 255, 255, 1);

    .fade-transform-box {
      height: auto;
      overflow-x: hidden;
      box-shadow: 2px 3px 3px 2px rgba(230, 230, 230, 0.8);
      border: rgba(220, 220, 220, 1) 1px solid;
      position: relative;
      background-color: #fcfcfc;
      border-radius: 10px;
    }
  }

  .el-aside {
    height: 100%;
    display: flex;
    width: auto;

    .el-scrollbar {
      border-right: rgba(230, 230, 230, 0.8) solid 1px;
    }

    .SideTitle {
      text-align: center;
    }

    .el-menu {
      border-right: none;
    }
  }
}

.el-avatar {
  margin: 5px 0 0 0;
}
.header_right{
  display: flex;
  align-items: center;
  .welcome{
    font-size: 12px;
    font-weight: bold;
  }
}
.iconfont{
  font-size: 20px;
}

</style>
