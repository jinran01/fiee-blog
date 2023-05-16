<template>
  <el-card class="main-card">
    <!-- 标题 -->
    <!--    <div class="title">{{ this.$route.name }}</div>-->
    <!-- 相册信息 -->
    <div class="album-info">
      <el-image fit="cover" v-if="getBodyWidth>=667" class="album-cover" :src="albumInfo.albumCover"/>
      <div class="album-detail">
        <div style="margin-bottom:10px" v-if="getBodyWidth>=667">
          <span class="album-name">{{ albumInfo.albumName }}</span>
          <span class="photo-count">{{ count }}张</span>
        </div>
        <div>
          <span v-if="albumInfo.albumDesc && getBodyWidth>=667" class="album-desc">
            {{ albumInfo.albumDesc }}
          </span>
          <el-button
              type="primary"
              @click="uploadPhoto = true"
              v-if="getBodyWidth>=667"
          >
            <template #icon>
              <el-icon>
                <Picture/>
              </el-icon>
            </template>
            上传照片
          </el-button>
          <el-button
              type="primary"
              @click="uploadPhoto = true"
              v-else
          >
            <template #icon>
              <el-icon>
                <Picture/>
              </el-icon>
            </template>
          </el-button>
        </div>
      </div>
      <!-- 相册操作 -->
      <div class="operation">
        <div class="all-check">
          <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <div class="check-count">已选择{{ selectPhotoIdList.length }}张</div>
        </div>
        <el-button
            type="success"
            @click="movePhotoDialog"
            :disabled="selectPhotoIdList.length == 0"
            v-if="getBodyWidth >= 667"
        >
          <template #icon>
            <el-icon>
              <Switch/>
            </el-icon>
          </template>
          移动到
        </el-button>
        <el-button
            type="success"
            @click="movePhotoDialog"
            :disabled="selectPhotoIdList.length == 0"
            v-else
        >
          <template #icon>
            <el-icon>
              <Switch/>
            </el-icon>
          </template>
        </el-button>
        <el-button
            type="danger"
            @click="batchDeletePhoto"
            :disabled="selectPhotoIdList.length == 0"
            v-if="getBodyWidth >= 667"
        >
          <template #icon>
            <el-icon>
              <Delete/>
            </el-icon>
          </template>
          批量删除
        </el-button>
        <el-button
            type="danger"
            @click="batchDeletePhoto"
            :disabled="selectPhotoIdList.length == 0"
            v-else
        >
          <template #icon>
            <el-icon>
              <Delete/>
            </el-icon>
          </template>
        </el-button>
      </div>
    </div>
    <!-- 照片列表 -->
    <el-row class="photo-container" :gutter="10" style="margin-top: 20px">
      <!-- 空状态 -->
      <el-empty v-if="photoList.length == 0" description="暂无照片"/>
      <el-checkbox-group
          v-model="selectPhotoIdList"
          @change="handleCheckedPhotoChange"
          style="width: 100%;margin-top: 20px;display: contents"
      >
        <el-col v-for="item in photoList" :key="item.id" class="photo-col el-col el-col-24 el-col-md-4">
          <el-checkbox :label="item.id">
            <div class="photo-item">
              <!-- 照片操作 -->
              <div class="photo-opreation">
                <el-dropdown>
                  <el-icon size="20" color="white">
                    <MoreFilled/>
                  </el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="updatePhoto(item)">
                        <el-icon>
                          <Edit/>
                        </el-icon>
                        编辑
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <el-image
                  fit="cover"
                  class="photo-img"
                  :src="item.photoSrc"
              />
              <div class="photo-name">{{ item.photoName }}</div>
            </div>
          </el-checkbox>
        </el-col>
      </el-checkbox-group>
    </el-row>
    <!-- 分页 -->
    <!--    <el-pagination-->
    <!--        :hide-on-single-page="true"-->
    <!--        class="pagination-container"-->
    <!--        @size-change="sizeChange"-->
    <!--        @current-change="currentChange"-->
    <!--        :current-page="current"-->
    <!--        :page-size="size"-->
    <!--        :total="count"-->
    <!--        layout="prev, pager, next"-->
    <!--    />-->
    <!-- 上传模态框 -->
    <el-dialog v-model="uploadPhoto" :width="getBodyWidth>667 ? '70%':'95%'" top="10vh">
      <div class="dialog-title-container" slot="title">
        上传照片
      </div>
      <!-- 上传 -->
      <div class="upload-container">
        <el-upload
            v-show="uploadList.length > 0"
            action="https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/"
            list-type="picture-card"
            :file-list="uploadList"
            :data="data"
            multiple
            :before-upload="beforeUpload"
            :on-success="upload"
            style="width: 100%;height: 100%"
        >
          <el-icon>
            <Plus/>
          </el-icon>
        </el-upload>
        <div class="upload_empty">
          <el-upload
              v-show="uploadList.length == 0"
              drag
              action="https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/"
              multiple
              :data="data"
              :before-upload="beforeUpload"
              :on-success="upload"
              :show-file-list="false"
          >
            <el-icon class="el-icon--upload">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持上传jpg/png文件
              </div>
            </template>
          </el-upload>
        </div>
      </div>
      <div slot="footer">
        <div class="upload-footer">
          <div class="upload-count">共上传{{ uploadList.length }}张照片</div>
          <div style="margin-left:auto">
            <el-button @click="uploadPhoto = false">取 消</el-button>
            <el-button
                @click="savePhotos"
                type="primary"
                :disabled="uploadList.length == 0"
            >
              开始上传
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog v-model="editPhoto" :width="getBodyWidth > 667 ? '40%' : '95%'">
      <template #header>
        <div style="font-size: 18px">
          <el-icon>
            <Edit/>
          </el-icon>
          信息编辑
        </div>
      </template>
      <el-form label-width="80px" size="default" v-model="photoForm">
        <el-form-item label="照片名称">
          <el-input style="width:80%" v-model="photoForm.photoName"/>
        </el-form-item>
        <el-form-item label="照片描述">
          <el-input style="width:80%" v-model="photoForm.photoDesc"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editPhoto = false">取 消</el-button>
        <el-button type="primary" @click="doUpdatePhoto">
          确 定
        </el-button>
      </template>
    </el-dialog>
    <!-- 移动对话框 -->
    <el-dialog v-model="movePhoto" :width="getBodyWidth>667 ? '70%':'95%'">
      <template #header>
        <div style="font-size: 18px">
          <el-icon><Switch /></el-icon>
          信息编辑
        </div>
      </template>
      <el-empty v-if="albumList.length < 2" description="暂无其他相册"/>
      <el-form v-else label-width="80px" size="default" :model="photoForm">
        <el-radio-group v-model="selectAlbumId">
          <div class="album-check-item">
            <template v-for="item of albumList">
              <el-radio
                  v-if="item.id != albumId"
                  :key="item.id"
                  :label="item.id"
                  style="margin-bottom:1rem"
              >
                <div class="album-check">
                  <el-image
                      fit="cover"
                      class="album-check-cover"
                      :src="item.albumCover"
                  />
                  <div style="text-align: center">{{ item.albumName }}</div>
                </div>
              </el-radio>
            </template>
          </div>
        </el-radio-group>
      </el-form>
      <template #footer>
        <el-button @click="movePhoto = false">取 消</el-button>
        <el-button
            :disabled="selectAlbumId == 0"
            type="primary"
            @click="updatePhotoAlbum"
        >
          确 定
        </el-button>
      </template>

    </el-dialog>
  </el-card>
</template>

<script>
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import router from "@/router";
import {getAlbumById, getAlbums, getOssToken} from "@/network/album";
import store from "@/store";
import {getPhotoOssToken, getPhotos, removePhotos, savePhoto} from "@/network/photo";
import {ElMessage, ElMessageBox} from "element-plus";
import * as imageConversion from "image-conversion";
import {v4} from "uuid";

export default {
  name: "Photo",
  setup() {
    let checkAll = ref(false)
    let uploadPhoto = ref(false) //上传对话框
    let editPhoto = ref(false) //编辑对话框
    let movePhoto = ref(false) //相片移动对对话框
    let isIndeterminate = ref(false)
    let selectPhotoIdList = ref([])
    let photoList = ref([])
    let photoIdList = ref([])
    let uploadList = ref([])
    let albumList = ref([])
    let selectAlbumId = ref(0)
    let albumInfo = reactive({
      albumName: '',
      albumCover: '',
      albumDesc: '',
      photoCount: 10
    })
    let photoForm = reactive({
      id: 0,
      albumId: 0,
      photoName: '',
      photoDesc: ''
    })
    let state = reactive({
      bodyWidth: 0,
      current: 1,
      size: 10,
      count: 0,
      albumId: 0,
      isDelete: 0
    })
    //请求oss 数据
    let data = {
      'key': '',
      'policy': '',
      'OSSAccessKeyId': '',
      'signature': '',
    }
    //执行更新操作
    const doUpdatePhoto = () => {
      let data = [{id: photoForm.id, photoName: photoForm.photoName, photoDesc: photoForm.photoDesc}]
      savePhoto(data).then(res => {
        if (res.flag) {
          ElMessage({
            type: "success",
            message: "修改成功！"
          })
          init()
          editPhoto.value = !editPhoto.value
        } else {
          ElMessage({
            type: "error",
            message: "操作失败！"
          })
        }
      })
    }
    //打开更新对话框
    const updatePhoto = (photo) => {
      photoForm.id = photo.id
      photoForm.photoDesc = photo.photoDesc
      photoForm.photoName = photo.photoName
      editPhoto.value = !editPhoto.value
    }
    //保存相片
    const savePhotos = () => {
      savePhoto(uploadList.value).then(res => {
        if (res.flag) {
          ElMessage({
            type: "success",
            message: "上传成功！"
          })
          init()
          uploadPhoto.value = !uploadPhoto.value
        } else {
          ElMessage({
            type: "error",
            message: "操作失败！"
          })
        }
      })
    }
    //移除上传相片列表
    // const handleRemove = (file) => {
    //   console.log(file)
    // }
    //上传前
    const beforeUpload = (file) => {
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
        } else {
          new_file = file
        }
        getPhotoOssToken().then(res => {
          if (res.flag) {
            let uuid = v4()
            data.signature = res.data.signature,
                data.policy = res.data.policy,
                data.OSSAccessKeyId = res.data.accessKeyId,
                data.key = res.data.dir + uuid + "." + type,
                file.photoName = new Date().getTime()
            file.photoSrc = "https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/" + data.key,
                file.albumId = state.albumId
            resolve(new_file)
          }
        })
      })
    }
    //上传成功回调
    const upload = (data, file, flies) => {
      uploadList.value = []
      flies.map(item => {
        uploadList.value.push({
          uid: item.uid,
          albumId: item.raw.albumId,
          photoName: item.raw.photoName,
          url: item.raw.photoSrc,
          photoSrc: item.raw.photoSrc
        })
      })
    }
    //打开移动相片对话框
    const movePhotoDialog = () => {
      selectAlbumId.value = 0
      getAlbums({keywords:''}).then(res=>{
        if (res.flag){
          albumList.value = res.data
        }
      })
      //关闭弹窗
      movePhoto.value = !movePhoto.value
    }
    //执行移动相片
    const updatePhotoAlbum = () => {
      let data = []
      selectPhotoIdList.value.map(item=>{
        data.push({id:item,albumId:selectAlbumId.value})
      })
      savePhoto(data).then(res=>{
        if (res.flag){
          ElMessage({
            type:"success",
            message:"操作成功"
          })
          //更新页面
          init()
          //关闭弹窗
          movePhoto.value = !movePhoto.value
        }else {
          ElMessage({
            type:"error",
            message:"操作失败"
          })
        }
      })
      console.log(selectPhotoIdList.value)
      console.log(selectAlbumId.value)
    }
    //批量删除相片
    const batchDeletePhoto = () => {
      ElMessageBox.confirm(
          '确定放入相片回收站吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {
        let data = []
        selectPhotoIdList.value.map(item => {
          data.push({id: item, isDelete: 1})
        })
        removePhotos(data).then(res => {
          if (res.flag) {
            ElMessage({
              type: "success",
              message: "操作成功！"
            })
            isIndeterminate.value = false
            selectPhotoIdList.value = []
            photoIdList.value = []
            photoList.value = []
            init()
          } else {
            ElMessage({
              type: "error",
              message: "操作失败！"
            })
          }
        })
      }).catch(() => {
      })
    }
    const getBodyWidth = computed(() => {
      state.bodyWidth = store.state.bodyWidth
      return state.bodyWidth
    })
    const handleCheckAllChange = (val) => {
      selectPhotoIdList.value = val ? photoIdList.value : [];
      isIndeterminate.value = false;
    }
    const handleCheckedPhotoChange = (value) => {
      let checkedCount = value.length;
      checkAll = checkedCount === photoIdList.value.length;
      isIndeterminate.value = checkedCount > 0 && checkedCount < photoIdList.value.length;
    }
    const init = () => {
      let url = window.location.href.split('/')
      let id = url[url.length - 1]
      state.albumId = id
      getAlbumById(id).then(res => {
        albumInfo.albumCover = res.data.albumCover
        albumInfo.albumName = res.data.albumName
        albumInfo.albumDesc = res.data.albumDesc
        albumInfo.photoCount = 10
      })
      let data = {}
      data.size = 100
      data.current = state.current
      data.isDelete = state.isDelete
      data.albumId = id
      getPhotos(data).then(res => {
        if (res.flag) {
          photoList.value = res.data.recordList
          res.data.recordList.map(item => {
            photoIdList.value.push(item.id)
          })
          state.count = res.data.count
        } else {
          ElMessage({
            type: "error",
            message: "出错了"
          })
        }

      })
    }
    onMounted(() => {
      init()
    })
    return {
      ...toRefs(state),
      selectAlbumId,
      albumInfo,
      photoList,
      selectPhotoIdList,
      isIndeterminate,
      checkAll,
      getBodyWidth,
      uploadPhoto,
      uploadList,
      data,
      editPhoto,
      photoForm,
      movePhoto,
      albumList,
      movePhotoDialog,
      doUpdatePhoto,
      updatePhoto,
      savePhotos,
      beforeUpload,
      upload,
      batchDeletePhoto,
      updatePhotoAlbum,
      handleCheckAllChange,
      handleCheckedPhotoChange
    }
  }
}
</script>

<style scoped lang="less">
.album-info {
  display: flex;
  margin-top: 10px;
}

.album-cover {
  border-radius: 4px;
  width: 100px;
  height: 100px;
}

.album-check-cover {
  border-radius: 4px;
  width: 100px;
  height: 100px;
}

.album-detail {
  margin-left: 15px;
}

.album-desc {
  font-size: 14px;
  margin-right: 0.8rem;
}

.operation {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.all-check {
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
}

.check-count {
  margin-left: 5px;
  font-size: 12px;
}

.album-name {
  font-size: 20px;
}

.photo-count {
  font-size: 12px;
  margin-left: 0.5rem;
}

.photo-item {
  width: 100%;
  position: relative;
  cursor: pointer;
  margin-bottom: 10px;
}

.photo-img {
  width: 100%;
  border-radius: 4px;
}

.photo-name {
  font-size: 14px;
  margin-top: 0.3rem;
  text-align: center;
}

.upload-container {
  height: 400px;
}

.upload {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .el-upload-dragger {
    height: 100%;
    width: 100%;
  }
}

.upload-footer {
  display: flex;
  align-items: center;
}

.photo-opreation {
  position: absolute;
  z-index: 1000;
  top: 10px;
  right: 20px;
}

.album-check-item{
  label{
    height: auto;
    margin-right: 25px;
  }
}
.el-checkbox {
  height: 100%;
}

</style>
