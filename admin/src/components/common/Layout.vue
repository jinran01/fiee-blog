<template>
  <div class="common-layout">
    <el-container direction="horizontal">
      <el-aside>
        <el-scrollbar>
          <el-menu
              router
              default-active="/users"
              class="el-menu-vertical-demo"
              :collapse="isCollapse"
              unique-opened
          >
            <h3 class="SideTitle">Fiee 管理系统</h3>
            <template v-for="(item) in menuList">
              <template v-if="item.children.length > 0">
                <el-sub-menu :index="item.path">
                  <template #title>
                    <el-icon>
                      <House/>
                    </el-icon>
                    <span>{{ item.name }}</span>
                  </template>
                  <el-menu-item v-for="(i,index) in item.children" :index="i.path" key="2322">
                    {{ i.name }}
                  </el-menu-item>
                </el-sub-menu>
              </template>
              <template v-if="item.children.length == 0">
                <el-menu-item :index="item.path">
                  <el-icon>
                    <House/>
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
          <el-page-header title=" ">
            <template #content>
              <el-breadcrumb separator=">" v-if="bodyWidth > 667">
                <el-breadcrumb-item v-for="(item,index) in routeList" :key="$route.fullPath">
                  {{ item.name }}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </template>
            <template #extra>
              <el-dropdown>
                <el-avatar style="margin-right: 50px"
                           src="https://laravel-shop-api-y.oss-cn-hangzhou.aliyuncs.com/avatar/aae5f1c1e9a24452dc7706cebd08d27a.jpg"/>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-icon>
                        <Avatar/>
                      </el-icon>
                      个人中心
                    </el-dropdown-item>
                    <el-dropdown-item @click="doLogout">
                      <el-icon>
                        <SwitchButton/>
                      </el-icon>
                      退出登录
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <template #icon>
              <el-icon @click="doOpenOrClose">
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
import {getMenuList} from "@/network/menu";
import User from "@/views/user/User";
import store from "@/store";
import router from "@/router";
import {logout} from "@/network/admin";
import {ElMessage} from "element-plus";


export default {
  name: "Layout",
  components: {
    User
  },
  setup() {
    let routeList = store.state.tabList
    let menuList = ref([])
    let isCollapse = ref(true)
    let isCached = ref("Menu")
    const doOpenOrClose = () => {
      isCollapse.value = isCollapse.value == true ? false : true
    }
    let state = reactive({
      bodyWidth:store.state.bodyWidth
    })
    onMounted(() => {
      getMenuList().then(res => {
        menuList.value = res.data
      })
    })
    const getBodyWidth = computed(() => {
      window.addEventListener("resize",()=>{
        state.bodyWidth = document.body.clientWidth
        store.state.bodyWidth = document.body.clientWidth
      })
      return state.bodyWidth;
    })
    watch(getBodyWidth, () => {
    })
    //随机获取标签颜色
    function randomType() {
      let type = ["", "success", "info", "danger", "warning"]
      let floor = Math.floor(Math.random() * 5);
      return type[floor]
    }
    const goTo = (item) => {
      router.push(item.path)
    }
    function handleNodeClick(obj, a) {
      console.log(a.checkedKeys);
      console.log(obj)
    }
    //关闭标签
    const handleClose = (tab) => {
      let index = store.state.tabList.findIndex(item => item.name === tab.name);
      store.commit("removeTab", index)
      //跳转到最后一个标签
      router.push(routeList[routeList.length - 1].path)
    }
    const handleCheckChange = (data, checked, indeterminate) => {
      console.log(data, checked, indeterminate, data.getCheckedKeys)
    }
    watch(() => router.currentRoute.value, (to, from) => {
      store.commit("addTab", {name: to.name, path: to.path})
    }, {immediate: true, deep: true})

    const defaultProps = {
      children: 'children',
      label: 'name',
    }
    //登出
    const doLogout = () => {
      logout().then(res=>{
        if (res.flag ){
          ElMessage({
            showClose: true,
            message: res.data,
            type: 'success',
          })
          router.push('/login')
        }
      })
    }
    return {
      ...toRefs(state),
      doOpenOrClose,
      menuList,
      isCollapse,
      ArrowRight,
      routeList,
      defaultProps,
      handleNodeClick,
      handleCheckChange,
      isCached,
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

    .el-page-header {
      border-bottom: rgba(230, 230, 230, 0.8) solid 1px;
    }

    border-bottom: rgba(230, 230, 230, 0.8) solid 1px;

    .tabList {
      box-shadow: 0 0px 3px 0 rgba(230, 230, 230, 0.9), 0 0 2px 0 rgba(230, 230, 230, 0.1);
      font-weight: bold;
      display: flex;
      overflow: hidden;

      .tab {
        margin-right: 8px;
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


</style>
