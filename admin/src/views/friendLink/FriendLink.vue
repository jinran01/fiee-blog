<template>
  <div class="main">
    <form class="main_form" :model="pageInfo">
      <!--      <el-date-picker-->
      <!--          v-model="keywords.date"-->
      <!--          type="daterange"-->
      <!--          start-placeholder="开始时间"-->
      <!--          end-placeholder="结束时间"-->
      <!--          @change="getDate"-->
      <!--      />-->
      <el-form-item>
        <el-button type="primary" @click="openAddOrUpdateLink(0)">
          <template #default v-if="getBodyWidth < 667">
            <el-icon v-if="getBodyWidth < 667">
              <Plus/>
            </el-icon>
          </template>
          <template #default v-else>
            <el-icon>
              <Plus/>
            </el-icon>
            添加
          </template>
        </el-button>
        <el-button type="danger" v-if="getBodyWidth >= 667" :disabled="flag" @click="openConfirm">
          <template #default>
            <el-icon>
              <Delete/>
            </el-icon>
            批量删除
          </template>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-input
            v-model="linkName"
            placeholder="昵称查询"
            :prefix-icon="Search"
            style="width: 200px;margin-right: 10px"
        />
        <el-button type="primary" :icon="Search" @click="searchUser"></el-button>
      </el-form-item>

    </form>
    <el-table
        :data="friendLinks"
        style="width: 100%"
        border
        @selection-change="selectLinks"
    >
      <el-table-column type="selection" width="50"/>
      <el-table-column prop="linkAvatar" label="友链头像" width="100" align="center">
        <template #default="scope">
          <img :src="scope.row.linkAvatar" width="40" height="40">
        </template>
      </el-table-column>
      <el-table-column prop="linkName" label="友链名称" width="150"/>
      <el-table-column prop="linkAddress" label="友链地址" min-width="200"/>
      <el-table-column prop="linkIntro" label="友链介绍" min-width="200"/>
      <el-table-column prop="createTime" label="创建时间" width="150">
        <template #default="scope">
          <el-icon>
            <timer/>
          </el-icon>
          {{ formatDate(scope.row.createTime, "YYYY-MM-dd") }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" :width="getBodyWidth > 667 ? '' : '160'">
        <template #default="scope">
          <el-button size="small" @click="openAddOrUpdateLink(scope.row)">
            <el-icon>
              <Edit/>
            </el-icon>
            编辑
          </el-button>
          <el-popconfirm
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              confirm-button-type="danger"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="确定要删除该友链吗？"
              @confirm="deleteLinks(scope.row.id,2)"
          >
            <template #reference>
              <el-button size="small" type="danger">
                <el-icon>
                  <Delete/>
                </el-icon>
                删除
              </el-button>
            </template>
          </el-popconfirm>

        </template>

      </el-table-column>
    </el-table>
    <el-pagination
        background
        layout="prev,pager,next"
        :page-size=pageInfo.size
        :total="count"
        @current-change="pageChange"
    />
    <!-- 添加或更新友链弹窗 -->
    <el-dialog v-model="dialogFormVisible" :width="getBodyWidth >= 667 ? '50%' : '95%'" destroy-on-close>
      <template #header>
        <el-icon>
          <el-icon size="15">
            <Link/>
          </el-icon>
        </el-icon>
        <span style="font-size: 14px;margin-left: 10px">{{ add_update ? '新增友链' : '更新友链' }}</span>
      </template>
      <el-form class="link_form" v-model="link">
        <el-form-item label="链 接 名">
          <el-input v-model="link.linkName"/>
        </el-form-item>
        <el-form-item label="链接头像">
          <el-input v-model="link.linkAvatar"/>
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="link.linkAddress"/>
        </el-form-item>
        <el-form-item label="链接介绍">
          <el-input v-model="link.linkIntro"/>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="doAddOrUpdate">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import {addOrUpdateLinks, delFriendLinks, getFriendLinks} from "@/network/friendLink";
import {Search, InfoFilled} from '@element-plus/icons-vue'
import {formatDate} from "@/common/js/formatDate";
import store from "@/store";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "FriendLink",
  setup() {
    let friendLinks = ref([]) //友链列表
    let pageInfo = ref({
      size: 10,
      current: 1,
      keywords: ''
    })
    let link = reactive({
      id: 0,
      linkName: '',
      linkAvatar: '',
      linkIntro: '',
      linkAddress: ''
    })
    let selectLinkList = ref([]) //选择的友链
    let state = reactive({
      count: 0,
      linkName: '',
      bodyWidth: 0,
      flag: true,  //是否多选
      dialogFormVisible: false,
      add_update: false //添加或者更新 新添false 更新true
    })
    //打开删除确认框
    const openConfirm = () => {
      ElMessageBox.confirm(
          '确定要删除吗？',
          '确认删除',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {
        //批量删除
        deleteLinks([],1)
      })
    }
    //执行删除友链
    const deleteLinks = (ids,flag) => {
      if (flag == 2){
        selectLinkList.value = []
        selectLinkList.value.push(ids)
      }
      delFriendLinks(selectLinkList.value).then(res=>{
        if (res.flag){
          ElMessage({
            type:'success',
            message:'删除成功'
          })
          getFriendLinkList(pageInfo.value)
        }else {
          ElMessage({
            type:'error',
            message:'删除失败'
          })
        }
      })
    }
    //执行更新或者新增操作
    const doAddOrUpdate = () => {
      let data = {}
      //判断是否为更新
      if (state.add_update) {
        data.id = link.id
        data.linkName = link.linkName
        data.linkAvatar = link.linkAvatar
        data.linkIntro = link.linkIntro
        data.linkAddress = link.linkAddress
      } else {
        data.linkName = link.linkName
        data.linkAvatar = link.linkAvatar
        data.linkIntro = link.linkIntro
        data.linkAddress = link.linkAddress
      }
      addOrUpdateLinks(data).then(res => {
        if (res.flag) {
          ElMessage({
            type: 'success',
            message: '操作成功'
          })
          getFriendLinkList(pageInfo.value)
          state.dialogFormVisible = !state.dialogFormVisible
        } else {
          ElMessage({
            type: 'error',
            message: '操作失败'
          })
        }
      })
    }
    //打开添加或更新友链对话框
    const openAddOrUpdateLink = (data) => {
      if (data.id != 0) {
        state.add_update = true
        //更新
        link.id = data.id
        link.linkName = data.linkName
        link.linkAvatar = data.linkAvatar
        link.linkIntro = data.linkIntro
        link.linkAddress = data.linkAddress
      } else {
        state.add_update = false
        //新增
        link.id = 0
        link.linkName = ''
        link.linkAvatar = ''
        link.linkIntro = ''
        link.linkAddress = ''
      }
      state.dialogFormVisible = !state.dialogFormVisible
    }
    //多选列表
    const selectLinks = (select) => {
      selectLinkList.value = []
      select.map(item => {
        selectLinkList.value.push(item.id)
      })
      if (selectLinkList.value.length == 0) {
        state.flag = true
      } else {
        state.flag = false
      }
    }
    const getBodyWidth = computed(() => {
      state.bodyWidth = store.state.bodyWidth
      return state.bodyWidth
    })
    //查询友链
    const searchUser = () => {
      pageInfo.value.keywords = state.linkName
      getFriendLinkList(pageInfo.value)
    }
    //改变当前页
    const pageChange = (page) => {
      // console.log(page)
      state.current = page
    }
    //获取友链列表
    const getFriendLinkList = (data) => {
      getFriendLinks(data).then(res => {
        if (res.flag) {
          friendLinks.value = res.data.recordList
        }
      })
    }
    onMounted(() => {
      getFriendLinkList(pageInfo.value)
    })
    return {
      ...toRefs(state),
      friendLinks,
      pageInfo,
      Search,
      InfoFilled,
      getBodyWidth,
      link,
      deleteLinks,
      doAddOrUpdate,
      selectLinks,
      formatDate,
      pageChange,
      searchUser,
      openConfirm,
      openAddOrUpdateLink
    }
  }
}
</script>

<style scoped lang="less">
.el-table {
  width: 100%;
  padding: 5px 10px 5px 10px;
  border-radius: 10px;
  box-shadow: 2px 2px 2px 2px rgba(200, 200, 200, 0.7);
}

.el-pagination {
  float: right;
  padding: 10px;
}

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
</style>
