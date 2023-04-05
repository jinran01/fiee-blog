<template>
  <div class="main">
    <el-tabs v-model="activeName" class="website_tabs">
      <el-tab-pane name="first">
        <template #label>
        <span>
          <el-icon><Monitor/></el-icon>
          <span>网站信息</span>
        </span>
        </template>
        <div class="web_info">
          <el-form
              label-position="right"
              label-width="100px"
              :model="webInfoConfig"
              style="max-width: 460px"
          >
            <el-form-item label="头 像">
              <el-upload
                  action="https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/"
                  :show-file-list="false"
                  :auto-upload="true"
                  :data="data"
                  :before-upload="before_upload"
                  :on-success="config_success"
              >
                <el-avatar shape="circle" :size="100" fit="fit" :src="webInfoConfig.websiteAvatar"/>
              </el-upload>
              <!--              <el-avatar shape="circle" :size="100" fit="fit" :src="userInfo.avatar" />-->
            </el-form-item>
            <el-form-item label="网站名称">
              <el-input v-model="webInfoConfig.websiteName"/>
            </el-form-item>
            <el-form-item label="网站作者">
              <el-input v-model="webInfoConfig.websiteAuthor"/>
            </el-form-item>
            <el-form-item label="网站简介">
              <el-input v-model="webInfoConfig.websiteIntro"/>
            </el-form-item>
            <el-form-item label="网站公告">
              <el-input v-model="webInfoConfig.websiteNotice" type="textarea"/>
            </el-form-item>
            <el-form-item label="网站创建日期">
              <el-date-picker
                  v-model="webInfoConfig.websiteCreateTime"
                  type="date"
              />
            </el-form-item>
            <el-form-item label="备案号">
              <el-input v-model="webInfoConfig.websiteRecordNo"/>
            </el-form-item>
            <el-form-item label="第三方登录">
              <el-checkbox-group v-model="webInfoConfig.socialLoginList">
                <el-checkbox label="qq">QQ</el-checkbox>
                <el-checkbox label="weibo">微博</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button style="margin: 20px 20px;width: 100px" type="primary" @click="saveWebInfoConfig">保 存
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane name="second">
        <template #label>
          <span>
            <el-icon><User/></el-icon>
            <span>社交信息</span>
          </span>
        </template>
        <el-form
            label-position="right"
            label-width="100px"
            :model="webInfoConfig"
            style="max-width: 460px"
        >
          <el-checkbox-group v-model="webInfoConfig.socialUrlList">
            <el-form-item label="QQ">
              <el-input v-model="webInfoConfig.qq"/>
              <el-checkbox label="qq">是否展示</el-checkbox>
            </el-form-item>
            <el-form-item label="Github">
              <el-input v-model="webInfoConfig.github"/>
              <el-checkbox label="github">是否展示</el-checkbox>
            </el-form-item>
            <el-form-item label="Gitee">
              <el-input v-model="webInfoConfig.gitee"/>
              <el-checkbox label="gitee">是否展示</el-checkbox>
            </el-form-item>
          </el-checkbox-group>
          <el-form-item>
            <el-button style="margin: 20px 20px;width: 100px" type="primary" @click="saveWebInfoConfig">保 存
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="third">
        <template #label>
          <span>
            <el-icon><Setting/></el-icon>
            <span>其他设置</span>
          </span>
        </template>
        <el-form
            label-position="right"
            label-width="100px"
            :model="webInfoConfig"
            style="max-width: 460px"
        >
          <el-form-item label="用户头像">
            <el-upload
                action="https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/"
                :show-file-list="false"
                :auto-upload="true"
                :data="data"
                :before-upload="before_upload"
                :on-success="userAvatar"
            >
              <el-avatar shape="circle" :size="100" fit="fit" :src="webInfoConfig.websiteAvatar"/>
            </el-upload>
          </el-form-item>
          <el-form-item label="游客头像">
            <el-upload
                action="https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/"
                :show-file-list="false"
                :auto-upload="true"
                :data="data"
                :before-upload="before_upload"
                :on-success="visitor_success"
            >
              <el-avatar shape="circle" :size="100" fit="fit" :src="webInfoConfig.websiteAvatar"/>
            </el-upload>
          </el-form-item>
          <el-form-item label="默认文章封面">
            <el-upload
                action="https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/"
                :show-file-list="false"
                :auto-upload="true"
                :data="data"
                :before-upload="before_upload"
                :on-success="cover_success"
                class="el-upload_img"
            >
            </el-upload>
          </el-form-item>
          <el-form-item label="邮箱提醒">
            <el-radio-group v-model="webInfoConfig.isEmailNotice">
              <el-radio :label=1 size="large">开启</el-radio>
              <el-radio :label=0 size="large">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="评论审核">
            <el-radio-group v-model="webInfoConfig.isCommentReview">
              <el-radio :label=1 size="large">开启</el-radio>
              <el-radio :label=0 size="large">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="留言审核">
            <el-radio-group v-model="webInfoConfig.isMessageReview">
              <el-radio :label=1 size="large">开启</el-radio>
              <el-radio :label=0 size="large">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="打赏状态">
            <el-radio-group v-model="webInfoConfig.isReward">
              <el-radio :label=1 size="large">开启</el-radio>
              <el-radio :label=0 size="large">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <!--打赏二维码-->
          <div v-if="webInfoConfig.isReward == 1">
            <el-form-item label="微信二维码">
              <el-upload
                  action="https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/"
                  :show-file-list="false"
                  :auto-upload="true"
                  :data="data"
                  :before-upload="before_upload"
                  :on-success="wechat_success"
              >
                <el-avatar shape="square" :size="100" fit="fit" :src="webInfoConfig.weiXinQRCode"/>
              </el-upload>
            </el-form-item>
            <el-form-item label="支付宝二维码">
              <el-upload
                  action="https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/"
                  :show-file-list="false"
                  :auto-upload="true"
                  :data="data"
                  :before-upload="before_upload"
                  :on-success="alipay_success"
              >
                <el-avatar shape="square" :size="100" fit="fit" :src="webInfoConfig.alipayQRCode"/>
              </el-upload>
            </el-form-item>
          </div>
          <el-form-item label="聊天室状态">
            <el-radio-group v-model="webInfoConfig.isChatRoom">
              <el-radio :label=1 size="large">开启</el-radio>
              <el-radio :label=0 size="large">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="播放器状态">
            <el-radio-group v-model="webInfoConfig.isMusicPlayer">
              <el-radio :label=1 size="large">开启</el-radio>
              <el-radio :label=0 size="large">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button style="margin: 20px 20px;width: 100px" type="primary" @click="saveWebInfoConfig">保 存
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {getConfigOssToken, getWebConfig, updateWebConfig} from "@/network/webconfig";
import {onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import {v4} from "uuid";

export default {
  name: "Website",
  setup() {
    let activeName = ref('first')
    //请求oss 数据
    let data = {
      'key': '',
      'policy': '',
      'OSSAccessKeyId': '',
      'signature': '',
    };
    let webInfoConfig = ref({
      //网站基本设置
      websiteAvatar: '', //网站头像
      websiteName: '', //网站名称
      websiteIntro: '', //网站介绍
      websiteNotice: '', //网站公告
      websiteAuthor: '', //网站作者
      websiteCreateTime: '', //网站创建时间
      websiteRecordNo: '', //网站备案号
      socialLoginList: [], //网站第三方登录
      //网站社交信息设置
      socialUrlList: [],
      qq: "",
      github: "",
      gitee: "",
      //网站其他信息设置
      userAvatar: "",
      touristAvatar: "",
      isReward: 1,
      weiXinQRCode: "",
      alipayQRCode: "",
      articleCover: "",
      isChatRoom: 1,
      websocketUrl: "",
      isMusicPlayer: 1,
      isEmailNotice: 1,
      isCommentReview: 0,
      isMessageReview: 0
    })
    //社交信息
    let socialConfig = reactive({})
    //其他设置
    let otherConfig = reactive({})
    onMounted(() => {
      getWebsiteInfo()
    })
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
        getConfigOssToken().then(res => {
          data.signature = res.data.signature,
              data.policy = res.data.policy,
              data.OSSAccessKeyId = res.data.accessKeyId,
              data.key = res.data.dir + v4() + "." + type,
              resolve(flag)
        })
      })
    }
    //TODO
    let url = "https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/"
    //网站头像上传成功回调
    const config_success = () => {
      webInfoConfig.value.websiteAvatar = url+data.key
    }
    //用户默认头像上传成功回调
    const userAvatar = () => {
      webInfoConfig.value.userAvatar = url+data.key
    }
    //游客默认头像修改成功回调
    const visitor_success = () => {
      webInfoConfig.value.touristAvatar = url+data.key
    }
    //文章默认封面上传成功回调
    const cover_success = () => {
      webInfoConfig.value.articleCover = url+data.key
    }
    //微信打赏二维码上传成功回调
    const wechat_success = () => {
      webInfoConfig.value.weiXinQRCode = url+data.key
    }
    //支付宝打赏二维码上传成功回调
    const alipay_success = () => {
      webInfoConfig.value.alipayQRCode = url+data.key
    }
    //上传成功回调
    // const success = (data) => {
    //   console.log(data)
    //   let url = "https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/"
    //   console.log("上传成功")
      // let obj = {}
      // obj.id = userInfo.userInfoId
      // obj.avatar = data.key
      // updateUserAvatar(obj).then(res => {
      //   if (res.flag) {
      //     userInfo.avatar = res.data
      //     let data = JSON.parse(localStorage.getItem('userInfo'))
      //     data.userInfo.avatar = res.data
      //     store.state.userInfo = data
      //     localStorage.setItem("userInfo", JSON.stringify(data))
      //   }
      // })
    // }

    //保存网站设置信息
    const saveWebInfoConfig = () => {
      updateWebConfig(webInfoConfig.value).then(res => {
        if (res.flag) {
          ElMessage({
            type: 'success',
            message: '更新成功'
          })
          getWebsiteInfo()
        } else {
          ElMessage({
            type: 'error',
            message: '修改失败，' + res.message
          })
        }
      })
    }
    //获取网站配置信息
    const getWebsiteInfo = () => {
      getWebConfig().then(res => {
        if (res.flag) {
          webInfoConfig.value = res.data
        } else {
          ElMessage({
            type: 'error',
            message: '出错了'
          })
        }
      })
    }
    return {
      webInfoConfig,
      socialConfig,
      otherConfig,
      activeName,
      data,
      before_upload,
      config_success,
      cover_success,
      visitor_success,
      userAvatar,
      wechat_success,
      alipay_success,
      saveWebInfoConfig,
    }
  }
}
</script>

<style scoped lang="less">
.el-upload_img {
  height: 150px;
  width: 270px;
  border-radius: 10px;
  border: 1px #d9d9d9 dashed;

  div {
    width: 100%;
    height: 100%;
  }
}

.website_tabs {
  padding: 20px;

  i {
    margin-right: 5px;
  }
}
</style>
