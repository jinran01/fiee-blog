<template>
  <div class="login">
    <video poster="../../assets/images/bg.jpeg" loop="" autoplay>
      <source src="../../assets/images/bg.mp4">
    </video>
    <!--    <div class="form">-->
    <div class="form">
      <el-form
          ref="formRef"
          :model="form"
          label-width="0"
          class="demo-dynamic"
          hide-required-asterisk="true"
          size="large"
      >
        <div class="title">
          <span>系统登录</span>
        </div>

        <el-form-item
            class="el-form-fiee"
            prop="username"
            :rules="[
        {
          required: true,
          message: '请输入账号',
          trigger: 'blur',
        },
      ]"
        >
          <el-input v-model="form.username" :prefix-icon='User' />

        </el-form-item>
        <el-form-item
            class="el-form-fiee"
            prop="password"
            :rules="[
        {
          required: true,
          message: '请输入密码',
          trigger: 'blur',
        },

      ]"
        >
          <el-input v-model="form.password" type="password" :prefix-icon="Unlock" show-password class="-input__wrapper">
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="doLogin(form)" :loading="loadingFlag" style="opacity: 0.5">登录</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {login} from "@/network/admin";
import {User, Unlock} from '@element-plus/icons-vue'
import router from "@/router";
import store from "@/store";
import {generaMenu} from "@/assets/js/menu";


export default {
  name: "Login",
  setup() {
    let form = reactive({
      username: "fiee@qq.com",
      password: "123456"
    })
    let data = reactive({})
    let loadingFlag = ref(false)

    function doLogin(form) {
      loadingFlag.value = true
      login(form).then(res => {
        if (res.flag){
          store.dispatch("setMenu")
          //存储管理人员信息
          localStorage.setItem("userInfo", JSON.stringify(res.data))
          store.commit('setUserInfo',JSON.parse(localStorage.getItem("userInfo")))
          localStorage.setItem("token", res.data.token)
          store.commit("setLogin",true)
          setTimeout(() => {
            generaMenu();
            // store.state.LOGIN_FLAG = true
            loadingFlag.value = !loadingFlag.value
            router.push("/")
          }, 1000)
        }else {
          router.push("/login")
        }
      })
    }

    return {
      loadingFlag,
      form,
      doLogin,
      open,
      Unlock,
      User,
      data
    }
  }
}
</script>

<style scoped lang="less">
.bg {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: fixed;
}

.login {
  height: 100%;
  overflow: hidden;
  display: flex;

  video {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    z-index: -1;
  }

  .form {
    margin: 0 auto;
    display: flex;
    align-items: center;
    width: 520px;
    .el-form{
      width: 90%;
      margin: 0 auto;
      .title {
        text-align: center;
        margin-bottom: 35px;
        font-size: 26px;
        font-weight: bold;
        color: #eee
      }
      .el-form-item {
        border: 1px solid hsla(0, 0%, 100%, .1);
        background: rgba(0, 0, 0, .1);
        color: #454545;
        border-radius: 5px;
        .el-input {
          height: 50px;
          opacity: 0.6;
          font-size: 16px;
        }
      }
      button {
        width: 100%;
      }
    }

  }
}

.info {
  margin: 0 auto;
}

el-form {
  el-form-item {
    label {
      width: 0px;
    }
  }
}

.el-form-fiee{
  opacity: 0.2;
}
</style>
