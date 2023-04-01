<template>
  <div class="main">
    <el-tabs v-model="activeName" class="website_tabs" @tab-click="handleClick">
      <el-tab-pane name="first">
        <template #label>
        <span>
          <el-icon><Monitor /></el-icon>
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
                  :on-success="success"
              >
                <el-avatar shape="circle" :size="100" fit="fit" :src="webInfoConfig.websiteAvatar"/>
              </el-upload>
              <!--              <el-avatar shape="circle" :size="100" fit="fit" :src="userInfo.avatar" />-->
            </el-form-item>
            <el-form-item label="网站名称">
              <el-input v-model="webInfoConfig.websiteName" />
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
              <el-input v-model="webInfoConfig.websiteRecordNo" />
            </el-form-item>
            <el-form-item label="第三方登录">
              <el-checkbox-group v-model="webInfoConfig.socialLoginList">
                <el-checkbox label="qq" >QQ</el-checkbox>
                <el-checkbox label="weibo">微博</el-checkbox>
              </el-checkbox-group>
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
            <el-icon><User /></el-icon>
            <span>社交信息</span>
          </span>
        </template>

      </el-tab-pane>
      <el-tab-pane name="third">
        <template #label>
          <span>
            <el-icon><Setting /></el-icon>
            <span>其他设置</span>
          </span>
        </template>
        user
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {getWebConfig} from "@/network/webconfig";
import {onMounted, reactive, ref} from "vue";

export default {
  name: "Website",
  setup(){
    let activeName = ref('')
    //网站设置
    let webInfoConfig = reactive({
      websiteAvatar:'', //网站头像
      websiteName:'', //网站名称
      websiteIntro:'', //网站介绍
      websiteNotice:'', //网站公告
      websiteAuthor:'', //网站作者
      websiteCreateTime:'', //网站创建时间
      websiteRecordNo:'', //网站备案号
      socialLoginList:ref([]) //网站第三方登录
    })
    //社交信息
    let socialConfig = reactive({

    })
    //其他设置
    let otherConfig = reactive({

    })
    onMounted(()=>{
      getWebsiteInfo()
    })
    const getWebsiteInfo = () => {
      getWebConfig().then(res=>{
        if (res.flag){
          webInfoConfig.websiteAvatar = res.data.websiteAvatar
          webInfoConfig.websiteName = res.data.websiteName
          webInfoConfig.websiteIntro = res.data.websiteIntro
          webInfoConfig.websiteNotice = res.data.websiteNotice
          webInfoConfig.websiteAuthor = res.data.websiteAuthor
          webInfoConfig.websiteCreateTime = res.data.websiteCreateTime
          webInfoConfig.websiteRecordNo = res.data.websiteRecordNo
          webInfoConfig.socialLoginList.push(res.data.socialLoginList[0])
        }else {

        }
      })
    }
    return{
      webInfoConfig,
      socialConfig,
      otherConfig,
      activeName
    }
  }
}
</script>

<style scoped lang="less">
.website_tabs {
  padding: 20px;
  i {
    margin-right: 5px;
  }
}
</style>
