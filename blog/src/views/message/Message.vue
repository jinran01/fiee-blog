<template>
  <div class="message_main">
    <div class="message_banner" :style="cover">
      <h1 class="title" style="color:white;">留言板</h1>
      <div class="message-input">
      </div>
      <Barrage></Barrage>
    </div>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import Barrage from "@/components/Barrage";

export default {
  name: "Message",
  components:{
    Barrage
  },
  setup(){
    let messageList = ref([])

    //获取留言列表
    const getMessageList = () => {
      messageList.value.push({
        id: 11,
        avatar: "https://laravel-shop-api-y.oss-cn-hangzhou.aliyuncs.com/config/7edfa281ceb9b7beb3e700e546c4619b.jpg",
        msg: "this.msg",
        time: 5,
      })

      // getMessage().then(res=>{
      //   if (res.flag){
      //     messageList.value = res.data
      //     console.log(messageList.value)
      //   }else {
      //     ElMessage({
      //       type:'error',
      //       message:'出错了'
      //     })
      //   }
      // })
    }
    let cover =  "background: url(" + "https://laravel-shop-api-y.oss-cn-hangzhou.aliyuncs.com/config/7edfa281ceb9b7beb3e700e546c4619b.jpg" + ") center center / cover no-repeat";
    onMounted(()=>{
      getMessageList()
    })
    return{
      cover,
      messageList,
      getMessageList
    }
  }
}
</script>

<style scoped lang="less">
.message_main{
  height: 100%;
  .title{
    width: 200px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    top: 30%;
  }
  .message_banner{
    top: 0;
    left: 0;
    position: fixed;
    width: 100%;
    height: 100%;
  }
}

</style>
