<template>
  <v-snackbar v-model="show" top :timeout="2000" :color="color">
    <i :class="icon" style="margin-right: 10px;" />{{ message }}
  </v-snackbar>
</template>

<script>
import {reactive, toRefs,} from "vue";

export default {
  name:'Toast',
  props:{
    toast:{
      type:Object
    }
  },
  setup(props,context){
    console.log(props.toast)
    let state = reactive({
      show: false,
      message: "",
      type: "normal",
      color: "#49b1f5",
      icon: ""
    })
    let type = {
      error:{
        color: "#F56C6C",
        icon:"iconfont iconcuowu"
      },
      success:{
        color: "#52C41A",
        icon:"iconfont iconchenggong"
      },
      warning:{
        color: "#F57C00",
        icon:"iconfont iconchenggong"
      }
    }
    return{
      ...toRefs(state)
    }
  },
};
</script>
