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
        <el-select v-model="LoginType"
                   placeholder="登录方式"
                   v-if="bodyWidth >= 667"
                   style="margin-right: 10px"
                   @change="getTypeHandler"
                   clearable
                   @clear="clearTypeHandler"
                   >
          <el-option label="邮箱" :value="1" />
          <el-option label="QQ"  :value="2" />
          <el-option label="微博" :value="3" />
        </el-select>
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
      <el-table-column prop="roleList" label="用户角色" width="150">
        <template #default="scope">
          <el-tag v-for="item in scope.row.roleList" style="margin-right: 5px;margin-bottom: 2px">
            {{ item.roleName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="loginType" label="登录方式" width="90">
        <template #default="scope">
          <el-tag round v-if="scope.row.loginType == 1" type="success">邮箱</el-tag>
          <el-tag round v-else-if="scope.row.loginType == 2">QQ</el-tag>
          <el-tag round v-else type="danger">微博</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isDisable" label="用户状态" width="90">
        <template #default="scope">
          <el-switch
              v-model="scope.row.isDisable"
              @change="changeHandle(scope.row.userInfoId)"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
          />
        </template>
      </el-table-column>
      <el-table-column prop="ipAddress" label="登录ip" width="140"/>
      <el-table-column prop="ipSource" label="登录地址">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="150">
        <template #default="scope">
          <el-icon>
            <timer/>
          </el-icon>
          {{ formatDate(scope.row.createTime, "YYYY-MM-dd") }}
        </template>
      </el-table-column>
      <el-table-column prop="lastLoginTime" label="上次登录时间" width="150">
        <template #default="scope">
          <el-icon>
            <timer/>
          </el-icon>
          {{ formatDate(scope.row.lastLoginTime, "YYYY-MM-dd") }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="160">
        <template #default="scope">
          <el-button size="small" @click="doFormVisible(scope.row)">
            <el-icon>
              <EditPen/>
            </el-icon>
            编辑
          </el-button>
          <el-button size="small" type="danger">
            <el-icon>
              <Delete/>
            </el-icon>
            删除
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
    <el-dialog v-model="dialogFormVisible" :width="getBodyWidth >= 667 ? '50%' : '95%'" destroy-on-close>
      <template #header>
        <el-icon>
          <el-icon size="15">
            <Edit/>
          </el-icon>
        </el-icon>
        <span style="font-size: 14px;margin-left: 10px">用户信息修改</span>
      </template>
      <el-form :model="userInfo">
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="昵　称">
          <el-input v-model="userInfo.nickname" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="角　色">
          <el-checkbox-group v-model="userInfo.roleList">
            <el-checkbox v-for="item in roles" :label="item.roleName" :disabled="item.isDisable != 0"/>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateUser">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {getUserList, updateStatus, updateUserRole} from "@/network/user";
import {computed, onMounted, reactive, ref, toRefs, watch} from "vue";
import {formatDate} from "@/common/js/formatDate";
import {Check, Close} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";
import { Search } from '@element-plus/icons-vue'
import {getRoles} from "@/network/role";
import store from "@/store";

export default {

  name: "User",
  setup() {
    let LoginType = ref('')
    let nickname = ref('')
    let userList = ref([]);
    let userInfo = reactive({
      userId: 0,
      username: '',
      nickname: '',
      userInfoId: 0,
      roleList: []
    })
    let state = reactive({
      dialogFormVisible: false, //显示dialog
      bodyWidth: 0,// body宽度
      count: 0, //用户总条数
      roles: [], //获取所有角色
    })
    let pageInfo = {
      loginType:'',
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
    //登录类型查找用户
    const getTypeHandler = () =>{
      pageInfo.loginType = LoginType.value
      getUsers();
    }
    //清除登录类型选项
    const clearTypeHandler = () => {
      pageInfo.loginType = ''
      getUsers();
    }
    //更新用户信息(角色/昵称)
    const updateUser = () => {
      let roleIds = [];
      userInfo.roleList.map(item => {
        state.roles.map(i => {
          if (i.roleName == item) {
            roleIds.push(i.id)
          }
        })
      })
      userInfo.roleList = roleIds
      updateUserRole(userInfo).then(res => {
        if (res.code == 20000) {
          ElMessage({
            showClose: true,
            message: '修改成功',
            type: 'success',
          })
          getUsers();
        } else {
          ElMessage({
            showClose: true,
            message: '修改失败',
            type: 'error',
          })
        }
      })
      state.dialogFormVisible = !state.dialogFormVisible
    }
    // 打开or关闭对话
    const doFormVisible = (data) => {
      userInfo.roleList = []
      userInfo.userInfoId = data.userInfoId
      userInfo.userId = data.id
      userInfo.username = data.username
      userInfo.nickname = data.nickname
      let role = data.roleList
      role.map(item => {
        userInfo.roleList.push(item.roleName)
      })
      //获取所有角色
      getRoles(pageInfo).then(res => {
        state.roles = res.data.recordList
      })
      state.dialogFormVisible = true;
    }
    const getBodyWidth = computed(() => {
      state.bodyWidth = store.state.bodyWidth
      return state.bodyWidth;
    })
    //修改用户状态
    const changeHandle = (userInfoId) => {
      updateStatus({userInfoId}).then(res => {
        if (res.code == 20000) {
          ElMessage({
            showClose: true,
            message: '修改成功',
            type: 'success',
          })
        } else {
          ElMessage({
            showClose: true,
            message: '修改失败',
            type: 'error',
          })
        }
      })
    }
    const pageChange = (current) => {
      pageInfo.current = current
      getUsers();
    }
    //获取用户
    const getUsers = () => {
      getUserList(pageInfo).then(res => {
        console.log(pageInfo)
        console.log(res)
        state.count = res.data.count
        userList.value = res.data.recordList
        userList.value.map(item => {
          item.isDisable = item.isDisable == 1 ? false : true
        })
      })
    }
    onMounted(() => {
      getUsers();
    })
    return {
      getTypeHandler,
      Search,
      searchUser,
      getBodyWidth,
      ...toRefs(state),
      userList,
      formatDate,
      changeHandle,
      Check,
      Close,
      userInfo,
      doFormVisible,
      pageChange,
      pageInfo,
      updateUser,
      LoginType,
      clearTypeHandler,
      nickname
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
.main_form{
  float: right;
  margin-top: 18px;
  margin-right: 7px;
}

</style>
