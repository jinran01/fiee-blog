<template>
  <div class="main">
    <el-tabs v-model="activeName" class="setting_tabs" @tab-click="handleClick">
      <el-tab-pane name="first">
        <template #label>
        <span>
          <el-icon><User/></el-icon>
          <span>修改信息</span>
        </span>
        </template>
        <div class="user_info">
          <el-form
              label-position="right"
              label-width="100px"
              :model="userInfo"
              style="max-width: 460px"
          >
            <!--                  action="https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com"-->
            <el-form-item label="头 像">
              <el-upload
                  action="https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/"
                  :show-file-list="false"
                  :auto-upload="true"
                  :data="data"
                  :before-upload="before_upload"
                  :on-success="success"
              >
                <el-avatar shape="circle" :size="100" fit="fit" :src="userInfo.avatar"/>
              </el-upload>
              <!--              <el-avatar shape="circle" :size="100" fit="fit" :src="userInfo.avatar" />-->
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="userInfo.username" disabled/>
            </el-form-item>
            <el-form-item label="昵  称">
              <el-input v-model="userInfo.nickname"/>
            </el-form-item>
            <el-form-item label="个人简介">
              <el-input v-model="userInfo.intro" maxlength="50" show-word-limit type="textarea" autosize/>
            </el-form-item>
            <el-form-item>
              <el-button style="margin: 20px 20px;width: 100px" type="primary" @click="savaUserInfo">保 存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane name="second">
        <template #label>
          <span>
            <el-icon><EditPen/></el-icon>
            <span>修改密码</span>
          </span>
        </template>
        <div class="user_info">
          <el-form
              label-position="right"
              label-width="100px"
              :model="password"
              :rules="rules"
              style="max-width: 460px"
              ref="form"
          >
            <el-form-item label="旧密码" prop="old_password">
              <el-input v-model="password.old_password"
                        type="password"
                        show-password
                        clearable
                        placeholder="请输入旧密码"
              />
            </el-form-item>
            <el-form-item label="新密码" prop="new_password">
              <el-input v-model="password.new_password"
                        type="password"
                        show-password
                        clearable
                        placeholder="请输入新密码"/>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirm_password">
              <el-input v-model="password.confirm_password"
                        type="password"
                        show-password
                        clearable
                        placeholder="确认输入新密码"/>
            </el-form-item>
            <el-form-item>
              <el-button style="margin: 20px 20px;width: 100px" type="primary" @click="updateUserPass">保 存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {getAvatarOssToken, getOssToken, updateUserAvatar, updateUserInfo} from "@/network/user";
import {v4} from 'uuid'
import store from "@/store";
import {ElMessage} from "element-plus";
import router from "@/router";

export default {
  name: "Setting",
  setup() {
    let activeName = ref("first")
    let form = ref(null)
    //用户信息
    let userInfo = reactive({
      id: 0,
      userInfoId: 0,
      avatar: '',
      // email:'',
      intro: '',
      nickname: '',
      username: '',
    })
    //密码修改
    let password = reactive({
      old_password: '',
      new_password: '',
      confirm_password: ''
    })
    //请求oss 数据
    let data = {
      'key': '',
      'policy': '',
      'OSSAccessKeyId': '',
      'signature': '',
    };
    onMounted(() => {
      getUserInfo()
    })
    //修改密码
    const updateUserPass = () => {
      form.value.validate(flag => {
        if (flag){
          let data = {}
          data.id = userInfo.id
          data.old_password = password.old_password
          data.new_password = password.new_password
          data.confirm_password = password.confirm_password
          updateUserInfo(data).then(res=>{
            if (res.flag){
              ElMessage({
                type: 'success',
                message: '修改成功'
              })
              router.push('/login')
            }else {
              ElMessage({
                type: 'error',
                message: '修改失败,'+res.message
              })
            }
          })
        }
      })
    }
    //新密码验证
    const newPassword = (rule, value, callback) => {
      let re = new RegExp(/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{6,16}$/)
      if (!re.test(value)) {
        callback(new Error("密码应是6-16位数字、字母或字符！"));
      } else if (password.old_password == password.new_password) {
        callback(new Error("新旧密码不能一致"));
      } else {
        callback()
      }
    }
    //确认密码验证
    const confirmPassword = (rule, value, callback) => {
      if (password.new_password == value) {
        callback();
      } else {
        callback(new Error("两次输入的密码不一致"));
      }
    }
    //验证规则
    let rules = {
      old_password: [
        {required: true, message: '旧密码不能为空'},
      ],
      new_password: [
        {required: true, message: '新密码不能为空'},
        {validator: newPassword, trigger: 'blur'}
      ],
      confirm_password: [
        {required: true, message: '确认密码不能为空'},
        {validator: confirmPassword, trigger: 'blur'}
      ]
    }
    //上传前
    const before_upload = (file) => {
      let flag = false
      let types = ["jpg", "png", "jpeg", "JPG", "JPEG", "PNG"]
      let type = file.name.split(".")
      type = type[type.length - 1]
      if (types.indexOf(type) >= 0) {
        flag = true
      } else {
        flag = false
      }
      return new Promise((resolve, reject) => {
        getAvatarOssToken().then(res => {
          data.signature = res.data.signature,
              data.policy = res.data.policy,
              data.OSSAccessKeyId = res.data.accessKeyId,
              data.key = res.data.dir + v4() + "." + type,
              resolve(flag)
        })
      })
    }
    //上传成功回调
    const success = () => {
      let obj = {}
      obj.id = userInfo.userInfoId
      obj.avatar = data.key
      updateUserAvatar(obj).then(res => {
        if (res.flag) {
          userInfo.avatar = res.data
          let data = JSON.parse(localStorage.getItem('userInfo'))
          data.userInfo.avatar = res.data
          store.state.userInfo = data
          localStorage.setItem("userInfo", JSON.stringify(data))
        }
      })
    }
    //获取用户信息
    const getUserInfo = () => {
      let data = JSON.parse(localStorage.getItem('userInfo')).userInfo
      userInfo.avatar = data.avatar
      userInfo.id = data.id
      userInfo.userInfoId = data.userInfoId
      userInfo.intro = data.intro
      userInfo.nickname = data.nickname
      userInfo.username = data.username
    }
    //修改用户信息
    const savaUserInfo = () => {
      let obj = {}
      obj.id = userInfo.userInfoId
      obj.nickname = userInfo.nickname
      obj.intro = userInfo.intro
      updateUserInfo(obj).then(res => {
        if (res.flag) {
          let data = JSON.parse(localStorage.getItem('userInfo'))
          data.userInfo.nickname = obj.nickname
          data.userInfo.intro = obj.intro
          userInfo.nickname = obj.nickname
          userInfo.intro = obj.intro
          localStorage.setItem("userInfo", JSON.stringify(data))
          ElMessage({
            type: 'success',
            message: '修改成功'
          })
        } else {
          ElMessage({
            type: 'error',
            message: '修改失败'
          })
        }
      })
    }
    const handleClick = (tab) => {
      if (tab.props.name == "first") {
        // getUserInfo()
      } else {
        // console.log(form.value.validate(res=>{
        //   console.log(res)
        // }))
      }
    }
    return {
      activeName,
      userInfo,
      data,
      password,
      form,
      rules,
      handleClick,
      success,
      savaUserInfo,
      before_upload,
      updateUserPass
    }
  }
}
</script>

<style scoped lang="less">
.setting_tabs {
  padding: 20px;
  i {
    margin-right: 5px;
  }

  form {
    margin: 0 auto;
  }
}
</style>
