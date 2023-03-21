<template>
  <div class="main">
    <form :model="pageInfo">
      <!--      <el-date-picker-->
      <!--          v-model="keywords.date"-->
      <!--          type="daterange"-->
      <!--          start-placeholder="开始时间"-->
      <!--          end-placeholder="结束时间"-->
      <!--          @change="getDate"-->
      <!--      />-->
      <el-form-item>
        <el-input
            v-model="nickname"
            placeholder="昵称查询"
            :prefix-icon="Search"
            style="width: 200px;margin-right: 10px"
        />
        <el-button type="primary" :icon="Search" @click="searchUser"></el-button>
      </el-form-item>

    </form>
    <el-table :data="userList" border table-layout="fixed">
      <el-table-column type="selection" width="45"/>
      <el-table-column prop="avatar" label="头像" width="65">
        <template #default="scope">
          <img :src="scope.row.avatar" width="40" height="40">
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="150"/>
      <el-table-column prop="ipAddress" label="登录ip" width="140"/>
      <el-table-column prop="ipSource" label="登录地址">
      </el-table-column>
      <el-table-column prop="browser" label="浏览器">
      </el-table-column>
      <el-table-column prop="os" label="登录设备">
      </el-table-column>
      <el-table-column prop="lastLoginTime" label="上次登录时间" width="150">
        <template #default="scope">
          <el-icon>
            <timer/>
          </el-icon>
          {{ formatDate(scope.row.lastLoginTime, "YYYY-MM-dd") }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <el-button size="small" type="danger" @click="remove(scope.row.userInfoId)">
            <el-icon><SwitchButton /></el-icon>
            下线
          </el-button>
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
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import store from "@/store";
import {getOnlineUserList, removeUser} from "@/network/user";
import {formatDate} from "@/common/js/formatDate";
import {ElMessage} from "element-plus";
import { Search } from "@element-plus/icons-vue"

export default {
  name: "OnlineUser",
  setup(){
    let nickname = ref('')
    let userList = ref([]);
    let userInfo = reactive({
      userId: 0,
      userInfoId: 0,
    })
    let state = reactive({
      count: 0, //用户总条数
    })
    let pageInfo = {
      keywords:'',
      current: 1, // 当前页
      size: 10 //每页大小
    }
    //查找用户
    const searchUser = () => {
      console.log(pageInfo.nickname)
      pageInfo.keywords = nickname.value
      getUsers();
    }
    const pageChange = (current) => {
      pageInfo.current = current
      getUsers();
    }
    const getUsers = () => {
      getOnlineUserList(pageInfo).then(res => {
        state.count = res.data.count
        userList.value = res.data.recordList
      })
    }
    //下线用户
    const remove = (userInfoId) => {
      removeUser(userInfoId).then(res=>{
        if (res.flag){
          ElMessage({
            showClose: true,
            message: '操作成功',
            type: 'success',
          })
        }else {
          ElMessage({
            showClose: true,
            message: '操作失败',
            type: 'error',
          })
        }
      })
    }
    onMounted(() => {
      getUsers();
    })
    const getBodyWidth = computed(() => {
      state.bodyWidth = store.state.bodyWidth
      return state.bodyWidth;
    })
    return{
      ...toRefs(state),
      userList,
      userInfo,
      getBodyWidth,
      pageInfo,
      pageChange,
      formatDate,
      remove,
      nickname,
      Search,
      searchUser

    }
  }
}
</script>

<style scoped lang="less">

.el-table {
  width: 100%;
  padding: 5px 10px 5px 10px;
  border-radius: 10px;
  box-shadow: 2px 2px 2px 2px rgba(200,200,200,0.7);
}

.el-pagination {
  float: right;
  padding: 10px;
}
form{
  float: right;
  margin-top: 18px;
  margin-right: 7px;
}
</style>
