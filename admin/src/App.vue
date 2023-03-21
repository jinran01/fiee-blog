<template>
  <router-view/>
</template>

<style lang="less" scoped>
#app{
  height: 100%;
  width: 100%;
  position: relative;
  left: 0;
  top: 0;
}
</style>

<script>

import {onMounted} from "vue";
import {generaMenu} from "@/assets/js/menu";
import store from "@/store";
import {useStore} from "vuex";

export default {
  setup(){
    onMounted(()=>{
    })
    return{}
  }

}
</script>
