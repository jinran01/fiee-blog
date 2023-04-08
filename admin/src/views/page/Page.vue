<template>
  <div class="main">
    <div class="save_button">
      <el-button type="primary" @click="saveOrEdit">
        <el-icon>
          <Plus/>
        </el-icon>
        新增页面
      </el-button>
    </div>
    <div class="pages_contain">
      <div class="el-row">
        <div class="el-col el-col-24 el-col-md-6" v-for="item in pageList">
          <div class="page_item">
            <div class="page_op">
              <el-dropdown>
                <el-icon size="20" color="white">
                  <MoreFilled/>
                </el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="saveOrEdit(item)">
                      <el-icon>
                        <EditPen/>
                      </el-icon>
                      编辑
                    </el-dropdown-item>
                    <el-dropdown-item @click="open(item)">
                      <el-icon>
                        <Delete/>
                      </el-icon>
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="page_cover">
              <el-image :src="item.pageCover" class="img"/>
            </div>
            <div class="page_name">{{ item.pageName }}</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogFormVisible" :width="getBodyWidth >= 667 ? '50%' : '95%'" destroy-on-close>
      <template #header>
        <el-icon>
          <el-icon size="15">
            <Edit/>
          </el-icon>
        </el-icon>
        <span style="font-size: 14px;margin-left: 10px">修改页面</span>
      </template>
      <el-form :model="page">
        <el-form-item label="页面名称">
          <el-input v-model="page.pageName" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="页面标签">
          <el-input v-model="page.pageLabel" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="页面封面">
          <el-upload
              class="upload_cover"
              :show-file-list="false"
              drag
              action="https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/"
              :auto-upload="true"
              :data="data"
              :before-upload="before_upload"
              :on-success="success"
              v-if="page.pageCover == ''"
          >
            <el-icon class="el-icon--upload">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
              将文件拖拽到此处，或 <em>点击上传</em>
            </div>
          </el-upload>
          <el-upload
              class="upload_cover"
              :show-file-list="false"
              action="https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/"
              :auto-upload="true"
              :data="data"
              :before-upload="before_upload"
              :on-success="success"
              v-else
          >
            <el-image :src="page.pageCover" style="border-radius: 10px;height: 175px"/>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="doSaveOrUpdate">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import {delPage, getPageOssToken, getPages, saveOrUpdatePage} from "@/network/page";
import store from "@/store";
import {getConfigOssToken} from "@/network/webconfig";
import {v4} from "uuid";
import {ElMessage, ElMessageBox} from "element-plus";
import * as imageConversion from "image-conversion";

export default {
  name: "Page",
  setup() {
    let pageList = ref()
    let state = reactive({
      dialogFormVisible: false, //显示对话框
      bodyWidth: 0
    })
    let page = reactive({
      id: 0,
      pageName: '',
      pageLabel: '',
      pageCover: '',
    })
    //请求oss 数据
    let data = {
      'key': '',
      'policy': '',
      'OSSAccessKeyId': '',
      'signature': '',
    }
    const getBodyWidth = computed(() => {
      state.bodyWidth = store.state.bodyWidth
      return state.bodyWidth
    })
    const open = (item) => {
      ElMessageBox.confirm(
          '确定要删除该页面吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {
        //删除页面
        delPage(item.id).then(res => {
          if (res.flag) {
            ElMessage({
              type: 'success',
              message: '删除成功'
            })
            getPageList()
          } else {
            ElMessage({
              type: 'error',
              message: '删除失败，' + res.message
            })
          }
        })
      })
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
        let new_file
        if (file.size / 1024 > 200) {
          imageConversion.compressAccurately(file, 200).then(res => {
            new_file = res
          })
        }
        getPageOssToken().then(res => {
          data.signature = res.data.signature,
              data.policy = res.data.policy,
              data.OSSAccessKeyId = res.data.accessKeyId,
              data.key = res.data.dir + v4() + "." + type,
              resolve(new_file)
        })
      })
    }
    //上传成功的回调
    const success = () => {
      let url = "https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/"
      page.pageCover = url + data.key
    }
    //执行保存或者更新操作
    const doSaveOrUpdate = () => {
      let data = {}
      if (page.id == 0) {
        //新增
        data.pageLabel = page.pageLabel
        data.pageName = page.pageName
        data.pageCover = page.pageCover
      } else {
        //更新
        data.id = page.id
        data.pageLabel = page.pageLabel
        data.pageName = page.pageName
        data.pageCover = page.pageCover
      }
      saveOrUpdatePage(data).then(res => {
        if (res.flag) {
          ElMessage({
            type: 'success',
            message: '操作成功'
          })
          state.dialogFormVisible = !state.dialogFormVisible
          getPageList()
        } else {
          ElMessage({
            type: 'error',
            message: '操作失败'
          })
        }
      })
    }
    //新增或者保存
    const saveOrEdit = (item) => {
      if (item.id != null) {
        //更新
        page.id = item.id
        page.pageName = item.pageName
        page.pageLabel = item.pageLabel
        page.pageCover = item.pageCover
      } else {
        //新增
        page.id = 0
        page.pageName = ''
        page.pageLabel = ''
        page.pageCover = ''
      }
      state.dialogFormVisible = !state.dialogFormVisible
    }
    //获取页面
    const getPageList = () => {
      getPages().then(res => {
        if (res.flag) {
          pageList.value = res.data
        }
      })
    }
    onMounted(() => {
      getPageList()
    })
    return {
      ...toRefs(state),
      saveOrEdit,
      doSaveOrUpdate,
      before_upload,
      success,
      open,
      getBodyWidth,
      pageList,
      page,
      data,
    }
  }
}
</script>

<style scoped lang="less">
.pages_contain {
  padding: 10px;
  display: flex;

  .page_item {
    position: relative;
    width: 100%;

    .page_op {
      position: absolute;
      z-index: 99;
      top: .3rem;
      right: .6rem;
    }

    .page_cover {
      border-radius: 5px;
      padding-left: 5px;
      padding-right: 5px;
      height: 170px;
      border-radius: 7px;

      .img {
        width: 100%;
        height: 170px;
        border-radius: 5px;
      }
    }

    .page_name {
      margin: 7px 0 7px 0;
      text-align: center;
      font-size: 18px;
      color: #303133;
    }
  }
}

.save_button {
  margin: 15px;
}

.upload_cover {
  width: 350px;
}
</style>
