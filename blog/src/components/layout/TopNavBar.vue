<template>
  <v-app-bar app :class="`${navClass} ${flag?'fade_in':'fade_out'}`" flat height="60">
    <!-- 手机端导航栏 -->
    <div class="d-md-none nav-mobile-container">
      <div style="font-size:18px;font-weight:bold">
        <router-link to="/">
          {{ blogInfo.websiteConfig.websiteAuthor }}
        </router-link>
      </div>
      <div style="margin-left:auto">
        <a @click="openSearch"><i class="iconfont iconsousuo"/></a>
        <a @click="openDrawer" style="margin-left:10px;font-size:20px">
          <i class="iconfont iconhanbao"/>
        </a>
      </div>
    </div>
    <!-- 电脑导航栏 -->
    <div class="d-md-block d-none nav-container">
      <div class="float-left blog-title">
        <router-link to="/">
          Fiee、
        </router-link>
      </div>
      <div class="float-right nav-title">
        <div class="menus-item">
          <a class="menu-btn" @click="openSearch">
            <i class="iconfont iconsousuo"/> 搜索
          </a>
        </div>
        <div class="menus-item">
          <router-link class="menu-btn" to="/">
            <i class="iconfont iconzhuye"/> 首页
          </router-link>
        </div>
        <div class="menus-item">
          <v-menu
              open-on-hover
          >
            <template #activator="{ props }">
              <a
                  color="primary"
                  v-bind="props"
              >
                <i class="iconfont iconfaxian"/> 发现
                <i class="iconfont iconxiangxia2 expand"/>
              </a>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <router-link to="/archives" style="color: #4c4948">
                    <i class="iconfont iconguidang"/> 归档
                  </router-link>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <router-link to="/categories" style="color: #4c4948">
                    <i class="iconfont iconfenlei"/> 分类
                  </router-link>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <router-link to="/tags" style="color: #4c4948">
                    <i class="iconfont iconbiaoqian"/> 标签
                  </router-link>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div class="menus-item">
          <v-menu
              open-on-hover
          >
            <template #activator="{ props }">
              <a
                  color="primary"
                  v-bind="props"
              >
                <i class="iconfont iconqita"/> 娱乐
                <i class="iconfont iconxiangxia2 expand"/>
              </a>
            </template>

            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <router-link to="/albums" style="color: #4c4948">
                    <i class="iconfont iconxiangce1"/> 相册
                  </router-link>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <router-link to="/talks" style="color: #4c4948">
                    <i class="iconfont iconpinglun"/> 说说
                  </router-link>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div class="menus-item">
          <router-link class="menu-btn" to="/links">
            <i class="iconfont iconlianjie"/> 友链
          </router-link>
        </div>
        <div class="menus-item">
          <router-link class="menu-btn" to="/about">
            <i class="iconfont iconzhifeiji"/> 关于
          </router-link>
        </div>
        <div class="menus-item">
          <router-link class="menu-btn" to="/message">
            <i class="iconfont iconpinglunzu"/> 留言
          </router-link>
        </div>
        <div class="menus-item">
          <a
              class="menu-btn"
              v-if="!this.$store.state.avatar"
              @click="openLogin"
          >
            <i class="iconfont icondenglu"/> 登录
          </a>
          <template v-else>
            <img
                class="user-avatar"
                :src="this.$store.state.avatar"
                height="30"
                width="30"
            />
            <ul class="menus-submenu">
              <li>
                <router-link to="/user">
                  <i class="iconfont icongerenzhongxin"/> 个人中心
                </router-link>
              </li>
              <li>
                <a @click="logout"><i class="iconfont icontuichu"/> 退出</a>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </div>
  </v-app-bar>
</template>

<script>
import store from "@/store";
import {computed, reactive, ref, toRefs, watch} from "vue";

export default {
  name: "ToNavBar",
  props: {
    blogInfo: {
      type: Object,
    }
  },
  setup(props) {
    let navClass = ref('nav')
    let flag = ref(false)
    let blogInfo = store.state.blogInfo || props.blogInfo
    let state = reactive({
      scrollTop: 0
    })
    //开启搜索框
    const openSearch = () => {

    }
    const openDrawer = () => {
      store.state.drawer = !store.state.drawer
    }
    const getScrollTop = computed(() => {
      window.addEventListener("scroll", () => {
        state.scrollTop = document.documentElement.scrollTop;
      });
      return state.scrollTop
    })
    watch(getScrollTop, (newValue, oldValue) => {
      flag.value = false
      if (state.scrollTop > 60) {
        navClass.value = 'nav-fixed'
        if (newValue > oldValue) {
          flag.value = true
        }
      } else {
        flag.value = false
        navClass.value = 'nav'
      }
    })
    return {
      ...toRefs(state),
      getScrollTop,
      navClass,
      blogInfo,
      flag,
      openSearch,
      openDrawer,
    }
  },
};
</script>

<style scoped lang="less">
i {
  margin-right: 4px;
}

ul {
  list-style: none;
}

.nav {
  background: rgba(0, 0, 0, 0) !important;
  animation: top 0.3s 0.1s ease both;
}

.nav a {
  color: #eee !important;
}

.nav .menu-btn {
  text-shadow: 0.05rem 0.05rem 0.1rem rgba(0, 0, 0, 0.3);
}

.nav .blog-title a {
  text-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.15);
}

.theme--light.nav-fixed {
  background: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 5px 6px -5px rgba(133, 133, 133, 0.6);
}

.theme--dark.nav-fixed {
  background: rgba(18, 18, 18, 0.8) !important;
}

.theme--dark.nav-fixed a {
  color: rgba(255, 255, 255, 0.8) !important;
}

.theme--light.nav-fixed a {
  color: #4c4948 !important;
}

.nav-fixed {
  background-color: rgba(255, 255, 255, 0.3);

  .menus-item {
    a {
      color: rgba(0, 0, 0, 0.8) !important;
      text-shadow: none;
    }
  }

  .blog-title {
    text-shadow: none;
  }

  animation: top 0.3s 0.1s ease both;
}

.nav-container {
  font-size: 14px;
  width: 100%;
  height: 100%;
}

.nav-mobile-container {
  width: 100%;
  display: flex;
  align-items: center;
}

.blog-title,
.nav-title {
  display: flex;
  align-items: center;
  height: 100%;
}

.blog-title a {
  font-size: 18px;
  font-weight: bold;
}

.menus-item {
  display: inline-block;
  margin: 0 0 0 0.875rem;
}

.menus-item a {
  transition: all 0.2s;
}

.nav-fixed .menu-btn:hover {
  color: #49b1f5 !important;
}

.fade_in {
  animation: in 0.8s 0.2s ease both;
}

.fade_out {
  display: block;
}

.menu-btn:hover:after {
  width: 100%;
}

.menus-item a:after {
  position: absolute;
  bottom: -5px;
  left: 0;
  z-index: -1;
  width: 0;
  height: 3px;
  background-color: #80c8f8;
  content: "";
  transition: all 0.3s ease-in-out;
}

.user-avatar {
  cursor: pointer;
  border-radius: 50%;
}

.menus-item:hover .menus-submenu {
  display: block;
}

.menus-submenu {
  position: absolute;
  display: none;
  right: 0;
  width: max-content;
  margin-top: 8px;
  box-shadow: 0 5px 20px -4px rgba(0, 0, 0, 0.5);
  background-color: #fff;
  animation: submenu 0.3s 0.1s ease both;
}

.menus-submenu:before {
  position: absolute;
  top: -8px;
  left: 0;
  width: 100%;
  height: 20px;
  content: "";
}

.menus-submenu a {
  line-height: 2;
  color: #4c4948 !important;
  text-shadow: none;
  display: block;
  padding: 6px 14px;
}

.menus-submenu a:hover {
  background: #4ab1f4;
}

@keyframes submenu {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    filter: none;
    transform: translateY(0);
  }
}

@keyframes top {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    transform: translateY(-60px);
  }
  50% {
    opacity: 0.5;
    filter: alpha(opacity=0);
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    filter: none;
    transform: translateY(0);
  }
}

@keyframes in {
  100% {
    opacity: 0;
    filter: none;
    transform: translateY(-60px);
  }
  50% {
    opacity: 0.5;
    filter: alpha(opacity=0);
    transform: translateY(-30px);
  }
  0% {
    opacity: 1;
    filter: none;
    transform: translateY(0px);
  }
}
</style>
