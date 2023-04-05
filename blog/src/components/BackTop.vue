<template>
  <div class="rightside" :style="isShow">
    <div :class="'rightside-config-hide ' + isOut">
      <i :class="'iconfont rightside-icon ' + icon" @click="check"/>
    </div>
    <div class="setting-container" @click="show">
      <i class="iconfont iconshezhi setting"/>
    </div>
    <i @click="backTop" class="iconfont rightside-icon iconziyuanldpi"/>
  </div>
</template>

<script>
import {computed, reactive, ref, toRefs, watch} from "vue";

export default {
  setup() {
    const scrollLength = ref(0)
    let state = reactive({
      isShow: '',
      isOut: "rightside-out",
      icon: "iconyueliang"
    })
    //计算到顶部的距离
    const scrollToTop = computed(() => {
      window.addEventListener("scroll", () => {
        scrollLength.value = document.documentElement.scrollTop || document.body.scrollTop;
      })
      if (scrollLength.value > 100) {
        state.isShow = "opacity: 1;transform: translateX(-38px);"
      } else {
        state.isShow = ""
      }
      return scrollLength;
    })
    watch(scrollToTop, () => {
    })
    // 回到顶部
    const backTop = () => {
      window.scrollTo({
        behavior: "smooth",
        top: 0
      });
    }
    const show = () => {
      const flag = state.isOut == "rightside-out";
      state.isOut = flag ? "rightside-in" : "rightside-out";
    }
    const check = () => {
      const flag = state.icon == "iconyueliang";
      state.icon = flag ? "icontaiyang" : "iconyueliang";
      // vuetify.theme.dark = !vuetify.theme.dark;
    }
    return {
      ...toRefs(state),
      backTop,
      check,
      show
    }
  },
};
</script>

<style scoped>
.rightside {
  z-index: 9999;
  position: fixed;
  right: -38px;
  bottom: 85px;
  transition: all 0.5s;
}

.rightside-config-hide {
  transform: translate(35px, 0);
}

.rightside-out {
  animation: rightsideOut 0.3s;
}

.rightside-in {
  transform: translate(0, 0) !important;
  animation: rightsideIn 0.3s;
}

.rightside-icon,
.setting-container {
  display: block;
  margin-bottom: 2px;
  width: 30px;
  height: 30px;
  background-color: #49b1f5;
  color: #fff;
  text-align: center;
  font-size: 16px;
  line-height: 30px;
  cursor: pointer;
}

.rightside-icon:hover,
.setting-container:hover {
  background-color: #ff7242;
}

.setting-container i {
  display: block;
  animation: turn-around 2s linear infinite;
}

@keyframes turn-around {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rightsideOut {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(30px, 0);
  }
}

@keyframes rightsideIn {
  0% {
    transform: translate(30px, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}
</style>
