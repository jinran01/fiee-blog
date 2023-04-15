<template>
  <div class="bullet-container">
    <div class="sendMessage" >
      <div class="input" style="margin: auto;border-radius: 35px" >
        <input placeholder="说点什么" @focus="handlerFocus" @blur="handlerBlur" v-model="messageContent">
      </div>
      <el-button
          round
          v-if="state.flag"
          @click="sendMsg"
          style="background-color: rgba(255,255,255,0);border: white 1px solid;padding: 17px"
          class="animate__animated animate__bounceInDown"
      >
        发送
      </el-button>
      <el-button
          round
          v-if="!state.open_close && !state.flag"
          @click="stopped"
          style="background-color: rgba(255,255,255,0);border: white 1px solid;padding: 17px"
      >
        清除
      </el-button>
      <el-button
          round
          v-if="state.open_close && !state.flag"
          @click="auto"
          style="background-color: rgba(255,255,255,0);border: white 1px solid;padding: 17px"
      >
        开启
      </el-button>
<!--      <el-button v-if="true" @click="stopped">stopped</el-button>-->
    </div>
    <!-- @animationend css动画结束后触发-->
    <div v-for="bullet in bullets"
         :class="['bullet-'+bullet.status]"
         :id="bullet.id"
         :key="bullet.id"
         :style="{top:bullet.track.offset + 'px'}"
         class="bullet"
         @animationend="done(bullet)"
    >
      <div class="msgInfo" :style="{color:bullet.color}">
        <img :src=bullet.avatar style="width: 30px;height: 30px;border-radius: 30px;">
        {{ bullet.nickname }}:{{ bullet.content }}
<!--        <div style="position: relative;top: -32px;left: 35px">: {{ bullet.content }}</div>-->
      </div>
    </div>
    <v-snackbar v-model="toast.show" :timeout="2000" :color="toast.color" >
      <i :class="toast.icon" style="margin-right: 10px;" />
      {{ toast.message }}
    </v-snackbar>
  </div>
</template>

<script>
import {nextTick, onBeforeUnmount, onMounted, reactive, ref} from "vue";
import {addMessage, getMessage} from "@/network/message";

//弹幕
class Bullet {
  id
  status = 'waiting'
  nickname = '游客'
  avatar = 'https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/config/messageAvatar.png'
  content = ''
  color = ''
  track

}
//弹幕轨道
class Track {
  disabled = false
  offset = 0
}

export default {
  name: "Message",
  setup() {
    let bullets = ref([]);
    let bulletList = ref([]);
    let tracks = reactive([]);
    let messageContent = ref('')
    let toast = reactive({
      show:false,
      color:'#52C41A',
      icon:'iconfont iconchenggong',
      message:'感谢您所留下的足迹'
    })
    let state = reactive({
      trackCount: 10, //弹幕轨道数
      trackHeight: 56, //轨道高度
      current: 0, //当前弹幕
      flag:false, //发送弹幕按钮
      open_close:true  //开启或者清除弹幕按钮
    })
    let color = ['#ff0000','#ffa500','#008000','#0000ff','#ffc0cb','#800080']
    let timer = null
    //获取随机颜色
    const getColor = () => {
      return Math.floor(Math.random()*6)
    }
    const handlerFocus = () => {
      state.flag = !state.flag
    }
    const handlerBlur = () => {
      setTimeout(()=>{
        state.flag = !state.flag
      },500)
    }
    //发送弹幕
    const sendMsg = () => {
      let data = {}
      //TODO 用户数据
      data.messageContent = messageContent.value
      data.avatar = 'https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/config/messageAvatar.png'
      data.nickname = '游客'
      data.time = 9
      // toast.show = true
      addMessage(data).then(res=>{
        if (res.flag){
          toast.show = true
        }
      })
    }
    //装填弹幕
    const add = (i = 0) => {
      let bullet = new Bullet()
      bullet.id = bulletList.value[state.current].id
      bullet.nickname = bulletList.value[state.current].nickname
      bullet.avatar = bulletList.value[state.current].avatar
      bullet.content = bulletList.value[state.current].messageContent
      bullet.color = color[getColor()]
      bullet.track = tracks[i]
      bullets.value.push(bullet)
      if (state.current + 1 >= bulletList.value.length){
        state.current = 0
      }else {
        state.current = state.current + 1
      }
    }
    //发射弹幕
    const run = () => {
      bullets.value.forEach(bullet => {
        if (bullet.status == 'waiting') {
          bullet.track.disabled = true
          bullet.status = 'running'
          let w1 = document.body.clientWidth
          let w2 = document.getElementById(bullet.id).getBoundingClientRect().width
          const delay = (w2 / (w1 + w2)) * 6 * 1000
          setTimeout(() => {
            bullet.track.disabled = false
          }, delay)
        }
      })
    }
    //结束
    const done = (bullet) => {
      bullet.status = 'done'
      nextTick(() => {
        const index = bullets.value.indexOf(bullet)
        if (index > -1) {
          bullets.value.splice(index, 1)
        }
      })
    }
    const auto = () => {
      if (!timer) {
        timer = setInterval(() => {
          for (let i = 0; i < state.trackCount; i++) {
            let flag = tracks[i].disabled
            if (!flag) {
              add(i)
              nextTick(() => {
                run()
              })
              break
            }
          }
        }, 200)
      }
      state.open_close = !state.open_close
    }
    const stopped = () => {
      if (timer) {
        clearInterval(timer)
        timer = null
        bullets.value = []
      }
      state.open_close = !state.open_close
    }
    //获取留言
    const getMessageList = () => {
      getMessage().then(res=>{
        if (res.flag){
          bulletList.value = res.data
        }
      })
    }
    onBeforeUnmount(()=>{
      timer = clearInterval(timer)
      timer = null
    })
    onMounted(() => {
      getMessageList()
      setTimeout(()=>{
        auto()
      },1000)
      for (let i = 0; i < state.trackCount; i++) {
        let track = new Track()
        track.offset = i * state.trackHeight + state.trackHeight
        tracks.push(track)
      }
    })
    return {
      state,
      bullets,
      messageContent,
      toast,
      handlerFocus,
      handlerBlur,
      sendMsg,
      run,
      done,
      auto,
      stopped,
      add
    }
  }
}
</script>

<style scoped lang="less">
.sendMessage{
  display: flex;
  position: relative;
  top: 32%;
  margin: 0 auto;
  align-items: center;
  text-align: center;
  width: 300px;
  .input{
    input{
      border: 1px solid #f0f6fc;
      border-radius: 35px;
      height: 35px;
      outline:none;
      padding: 0 10px;
      color: #f0f6fc;
    }
  }
}
.bullet {
  position: absolute;
  white-space: nowrap;
  //border: 1px solid white;
  border: 1px rgba(255,255,255,0.1) solid;
  border-radius: 25px;
  background-color: rgba(255,255,255,0.2);
  &:hover{
    animation-play-state: paused;
    z-index: 9999;
  }
}

.bullet-container {
  height: 100%;
  width: 100%;
}

.bullet-waiting {
  left: 100%;
}

.bullet-running {
  animation: running 6s linear;
}

.bullet-done {
  left: 0;
  transform: translate3d(-100%, 0, 0);
}
.msgInfo{
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
}
@keyframes running {
  from {
    left: 100%;
    transform: translate3d(0, 0, 0);
  }
  to {
    left: 0;
    transform: translate3d(-100%, 0, 0);
  }
}

</style>
