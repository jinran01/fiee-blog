<template>
  <div class="album">
    <div class="operation">
      <el-button type="primary" @click="addOrEdit('')">
        <template #default v-if="getBodyWidth < 667">
          <el-icon>
            <Plus/>
          </el-icon>
        </template>
        <template #default v-else>
          <el-icon>
            <Plus/>
          </el-icon>
          新增相册
        </template>
      </el-button>
      <div class="operation_right">
        <el-button type="danger" @click="recycle" style="margin-right: 10px" v-if="getBodyWidth >= 667">
          <el-icon>
            <Delete/>
          </el-icon>
          回收站
        </el-button>
        <el-input
            v-model="albumName"
            placeholder="相册查询"
            :prefix-icon="Search"
            style="width: 200px;margin-right: 10px"
        />
        <el-button type="primary" :icon="Search" @click="searchAlbum"></el-button>
      </div>
    </div>
    <el-row class="el-row">
      <div class="el-col el-col-24 el-col-md-6" v-for="item in albumList">
        <div class="album_item">
          <div class="album-operation">
            <el-dropdown>
              <el-icon size="20" color="white">
                <MoreFilled/>
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="addOrEdit(item.id)">
                    <el-icon>
                      <EditPen/>
                    </el-icon>
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item @click="doRemoveAlbum(item.id)">
                    <el-icon>
                      <Delete/>
                    </el-icon>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="album-photo-count">
            2
          </div>
          <div class="el-image album-cover">
            <el-image
                style="height: 200px"
                :src="item.albumCover"
                class="img"
                @click="getPhotosById(item.id)">
              <template #error>
                <div class="image-slot">
                  <el-icon>
                    <icon-picture/>
                  </el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <div class="album-name">
            {{ item.albumName }}
          </div>
        </div>
      </div>
    </el-row>
    <!-- 添加/修改资源 -->
    <el-dialog v-model="dialogFormVisible" destroy-on-close :width="getBodyWidth < 667 ? '90%' : '50%'">
      <template #header>
        <!--        <el-icon>-->
        <!--          <el-icon size="15" v-if="flag_menu == 1">-->
        <!--            <Edit />-->
        <!--          </el-icon>-->
        <!--          <el-icon size="15" v-else>-->
        <!--            <Plus />-->
        <!--          </el-icon>-->
        <!--        </el-icon>-->
        <!--        <span style="font-size: 14px;margin-left: 10px">{{flag_menu == 0 ? '新增菜单' : '修改菜单'}}</span>-->
      </template>
      <el-form :model="form">
        <el-form-item label="相册名称">
          <el-input v-model="form.albumName" autocomplete="off"
                    :style="getBodyWidth > 667 ? 'width:60%' : 'width:100%'"/>
        </el-form-item>
        <el-form-item label="相册描述">
          <el-input v-model="form.albumDesc" autocomplete="off"
                    :style="getBodyWidth > 667 ? 'width:60%' : 'width:100%'"/>
        </el-form-item>
        <el-form-item label="相册封面">
          <el-upload
              class="upload_cover"
              :show-file-list="false"
              drag
              action="https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/"
              :auto-upload="true"
              :data="data"
              :before-upload="before_upload"
              :on-success="success"
              v-if="form.albumCover == ''"
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
            <el-image :src="form.albumCover" style="border-radius: 10px;height: 200px"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="发布形式">
          <el-radio v-model="form.status" label="1">公开</el-radio>
          <el-radio v-model="form.status" label="2">私密</el-radio>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="doAddAlbum">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import {Search} from "@element-plus/icons-vue";
import store from "@/store";
import {addAlbum, getAlbumById, getAlbums, getOssToken, removeAlbum} from "@/network/album";
import * as imageConversion from "image-conversion";
import {v4} from "uuid";
import {ElMessage, ElMessageBox} from "element-plus";
import router from "@/router";
import {getPhotos, getPhotosByAlbumId, savaPhoto, savePhoto} from "@/network/photo";

export default {
  name: "Album",
  setup() {
    let albumName = ref('')
    let albumList = ref([])
    //请求oss 数据
    let data = {
      'key': '',
      'policy': '',
      'OSSAccessKeyId': '',
      'signature': '',
    }
    let form = reactive({
      id:null,
      albumName: '',
      albumDesc: '',
      albumCover: '',
      status: '1'
    })
    let state = reactive({
      bodyWidth: 0,
      dialogFormVisible: false,
    })
    const searchAlbum = () => {
      getAlbumList();
    }
    const recycle = () => {
      router.push("/photos/delete")
    }
    //通过相册Id获取相片
    const getPhotosById = (albumId) => {
      let data = {
        current: 1,
        size: 10,
        isDelete: 0,
        albumId:albumId
      }
      getPhotos(data).then(res=>{
        router.push(`/albums/${albumId}`)
      })
    }
    //执行逻辑删除相册操作
    const doRemoveAlbum = (id) => {
      ElMessageBox.confirm(
          '确定要将该相册放入回收站吗？',
          '提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {
        removeAlbum(id).then(res => {
          if (res.flag) {
            ElMessage({
              type: "success",
              message: "操作成功"
            })
            getAlbumList();
          }
        })
      }).catch(()=>{})
    }
    //执行新增或更新相册操作
    const doAddAlbum = () => {
      if (form.id != null){ //编辑保存
        addAlbum(form).then(res => {
          if (res.flag) {
            ElMessage({
              type: 'success',
              message: '保存成功'
            })
            state.dialogFormVisible = !state.dialogFormVisible
            form.id = null
            form.albumName = ''
            form.albumDesc = ''
            form.albumCover = ''
            form.status = '1'
            getAlbumList();
          } else {
            ElMessage({
              type: 'error',
              message: '操作失败'
            })
          }
        })
      }else { //新增保存
        let data = {}
        data.albumName = form.albumName
        data.albumDesc = form.albumDesc
        data.albumCover = form.albumCover
        data.status = form.status
        addAlbum(data).then(res => {
          if (res.flag) {
            ElMessage({
              type: 'success',
              message: '保存成功'
            })
            let photo = {}
            photo.photoSrc = data.albumCover
            photo.albumId = res.data
            photo.photoName = data.albumName

            state.dialogFormVisible = !state.dialogFormVisible
            form.id = null
            form.albumName = ''
            form.albumDesc = ''
            form.albumCover = ''
            form.status = '1'
            savePhoto(photo)
            getAlbumList();
          } else {
            ElMessage({
              type: 'error',
              message: '操作失败'
            })
          }
        })
      }
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
        getOssToken().then(res => {
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
      console.log(form)
      let url = "https://spring-boot-blog-api.oss-cn-hangzhou.aliyuncs.com/"
      form.albumCover = url + data.key
    }
    //获取相册列表
    const getAlbumList = () => {
      getAlbums({keywords: albumName.value}).then(res => {
        albumList.value = res.data
      })
    }
    //打开对话框
    const addOrEdit = (data) => {
      form.id = null
      form.albumName = ''
      form.albumDesc = ''
      form.albumCover = ''
      form.status = '1'
      if (data != "") {
        getAlbumById(data).then(res => {
          console.log(res)
          if (res.flag) {
            form.id = data
            form.albumName = res.data.albumName
            form.albumDesc = res.data.albumDesc
            form.albumCover = res.data.albumCover
            form.status = `${res.data.status}`
          }
        })
      }
      state.dialogFormVisible = !state.dialogFormVisible
    }
    onMounted(() => {
      getAlbumList()
    })
    const getBodyWidth = computed(() => {
      state.bodyWidth = store.state.bodyWidth
      return state.bodyWidth
    })
    return {
      ...toRefs(state),
      form,
      albumName,
      getBodyWidth,
      Search,
      albumList,
      data,
      addOrEdit,
      before_upload,
      success,
      doAddAlbum,
      doRemoveAlbum,
      searchAlbum,
      recycle,
      getPhotosById
    }
  }
}
</script>

<style scoped lang="less">
.main_form {
  width: 100%;
  margin-top: 18px;

  .el-form-item:first-child {
    margin-left: 7px;
    float: left;
  }

  .el-form-item:last-child {
    margin-right: 7px;
    float: right;
  }
}

.album {
  .album_cover {
    border-radius: 5px;
    padding-left: 5px;
    padding-right: 5px;
    height: 170px;
    border-radius: 7px;
  }

  .operation {
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    padding: 5px;

    .operation_right {
      margin-left: auto;
    }
  }
}

.album_item {
  position: relative;
  width: 90%;
  margin: auto;

  .album-operation {
    z-index: 99;
    position: absolute;
    left: 270px;
    top: 10px;
  }

  .album-cover {
    border-radius: 10px;
    height: 200px;
    width: 100%;

    .img {
      width: 100%;

      .image-slot {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: var(--el-text-color-secondary);
        color: var(--el-text-color-secondary);
        font-size: 30px;
      }
    }
  }

  .album-photo-count {
    z-index: 99;
    position: absolute;
    left: 30px;
    top: 160px;
    font-size: 20px;
    font-weight: bold;
    color: white;
  }
}

.upload_cover {
  width: 350px;
}

.album-name {
  font-size: 18px;
  text-align: center;
  color: #303133;
}
</style>
