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
      <!--      <el-button type="primary"  @click="searchRole">添加角色</el-button>-->
      <el-form-item>
        <el-button type="primary" @click="addRole">
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
        <el-button type="danger" @click="delRole([],1)" v-if="getBodyWidth >= 667" :disabled="flag">
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
            v-model="roleName"
            placeholder="角色查询"
            :prefix-icon="Search"
            style="width: 200px;margin-right: 10px"
        />
        <el-button type="primary" :icon="Search" @click="searchRole"></el-button>
      </el-form-item>
    </form>
    <el-table :data="roleList"
              border
              @selection-change="selectRole"
              table-layout="fixed">
      <el-table-column type="selection" width="45"/>
      <el-table-column prop="roleName" label="角色名" width="200" align="center">
      </el-table-column>
      <el-table-column prop="roleLabel" label="角色标签" width="200" align="center">
        <template #default="scope">
          <el-tag>{{ scope.row.roleLabel }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isDisable" label="禁用" width="90" align="center">
        <template #default="scope">
          <el-switch
              v-model="scope.row.isDisable"
              inline-prompt
              @change="changeHandle(scope.row)"
              :active-icon="Check"
              :inactive-icon="Close"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200">
        <template #default="scope">
          <el-icon>
            <timer/>
          </el-icon>
          {{ formatDate(scope.row.createTime, "YYYY-MM-dd") }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" :width="getBodyWidth <= 667 ? '100' : ''">
        <template #default="scope">
          <span class="op" @click="updateMenuOrResource(scope.row,1)">
            <el-icon><List/></el-icon>
            菜单权限
          </span>
          <span class="op" @click="updateMenuOrResource(scope.row,2)">
            <el-icon><FolderAdd/></el-icon>
            资源权限
          </span>
          <span class="op" @click="delRole(scope.row.id,2)">
            <el-icon><Delete/></el-icon>
            删除
          </span>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        background
        layout="prev,pager,next"
        @current-change="pageChange"
        :page-size=pageInfo.size
        :total="count"
    />
    <!-- 修改权限弹窗 -->
    <el-dialog v-model="dialogFormVisible" :width="getBodyWidth >= 667 ? '50%' : '95%'" destroy-on-close>
      <template #header>
        <el-icon>
          <el-icon size="15"><EditPen /></el-icon>
        </el-icon>
        <span style="font-size: 14px;margin-left: 10px">修改资源权限</span>
      </template>
      <div v-loading="loading">
        <el-tree
            ref="tree"
            v-if="!loading"
            :data="resourceList"
            accordion
            show-checkbox
            node-key="id"
            :default-checked-keys="resourceListIds"
            :props="defaultProps"
            @check="handleCheckChange"
        />
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="doUpdate">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>
    <!-- 添加角色弹窗 -->
    <el-dialog v-model="dialogFormVisible_add" :width="getBodyWidth >= 667 ? '50%' : '95%'" destroy-on-close>
      <template #header>
        <el-icon>
          <el-icon size="15"><User /></el-icon>
        </el-icon>
        <span style="font-size: 14px;margin-left: 10px">新增角色</span>
      </template>
      <el-form class="add_form">
        <el-form-item label="角 色 名">
          <el-input
              placeholder="请输入角色名 如：管理员"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="角色标签">
          <el-input
              placeholder="请输入角色标签 如：admin"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
              ref="tree"
              :data="resourceList"
              accordion
              show-checkbox
              node-key="id"
              :props="defaultProps"
              @check="handleCheckChange"
          />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible_add = false">取消</el-button>
        <el-button type="primary" @click="doAddRole">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {delRoles, getRoles, roleStatus} from "@/network/role";
import {computed, onMounted, reactive, ref, toRefs, watch} from "vue";
import {ElMessage, ElTree} from "element-plus";
import {formatDate} from "@/common/js/formatDate";
import {Check, Close, Search} from "@element-plus/icons-vue";
import store from "@/store";
import {getResource} from "@/network/resource";

export default {
  name: "Role",
  setup() {
    let ids = [2, 3, 4, 19, 202, 205, 213, 215]  //根menu的Id
    let roleList = ref([])
    let selectRoles = reactive([]) //选择的角色
    let resourceList = ref([])  //菜单或资源列表
    let loading = ref(true)
    let roleName = ref('')
    let resourceListIds = ref([])
    let tree = ref(null) //获取 tree 对象
    let state = reactive({
      dialogFormVisible: false, //显示dialog
      dialogFormVisible_add : false, //显示dialog
      bodyWidth: 0,// body宽度
      count: 0, //用户总条数
      flag:true
    })
    let pageInfo = {
      size: 10,
      count: 0,
      current: 1,
      keywords: ''
    }
    let defaultProps = {
      id: 'id',
      label: 'name',
    }
    onMounted(() => {
      getRoleList();
    })
    const searchRole = () => {
      pageInfo.keywords = roleName.value
      getRoleList();
    }
    const handleCheckChange = () => {
      let menuIds = tree.value.getCheckedKeys(false)
      if (tree.value.getHalfCheckedKeys().length > 0) {
        tree.value.getHalfCheckedKeys().map(id => {
          menuIds.push(id)
        })
        //TODO 获取菜单ID
      }
    }
    const selectRole = (select) => {
      selectRoles = []
      select.map(item=>{
        selectRoles.push(item.id)
      })
      if (selectRoles.length == 0){
        state.flag = true
      }else {
        state.flag = false
      }
    }
    //删除角色
    const delRole = (selectIds,flag) => {
      //批量删除
      // if (flag == 1){
      //   console.log(selectRoles)
      // }
      //单删
      if (flag == 2){
        selectRoles = []
        selectRoles.push(selectIds)
      }
      if (selectRoles.length == 0){
        ElMessage({
          type:'error',
          message:'请选择要删除的角色'
        })
      }else {
        delRoles(selectRoles).then(res=>{
          if (res.flag){
            ElMessage({
              type:'success',
              message:'删除成功'
            })
          }else {
            ElMessage({
              type:'error',
              message:'删除失败，'+res.message
            })
          }
        })
      }
    }
    //添加角色
    const addRole = () => {
      resourceList.value = JSON.parse(localStorage.getItem('menuList'))
      state.dialogFormVisible_add = !state.dialogFormVisible_add
    }
    //TODO 添加角色
    //执行添加角色操作
    const doAddRole = () => {

    }
    //TODO 修改角色资源操作
    //执行修改角色操作
    const doUpdate = () => {
      // console.log()
    }
    const pageChange = (current) => {
      pageInfo.current = current
      getRoleList();
    }
    //修改角色菜单或者资源
    const updateMenuOrResource = (data, flag) => {
      defaultProps.label = 'name'
      //角色菜单修改
      if (flag == 1) {
        resourceListIds.value = []
        loading.value = true
        resourceList.value = JSON.parse(localStorage.getItem('menuList'))
        // getMenusById(id).then(res => {
        //   res.data.map(item => {
        //     //除去根menu的Id
        //     if (ids.indexOf(item.menuId) < 0) {
        //       menuListIds.value.push(item.menuId)
        //     }
        //   })
        //
        // })
        data.menuIdList.map(item => {
          //除去根menu的Id
          if (ids.indexOf(item) < 0) {
            resourceListIds.value.push(item)
          }
        })
      }
      //角色资源修改
      if (flag == 2) {
        defaultProps.label = 'resourceName'
        resourceListIds.value = []
        loading.value = true
        getResource().then(res => {
          console.log(res)
          resourceList.value = res.data
        })
        data.resourceIdList.map(item => {
          resourceListIds.value.push(item)
        })
      }
      state.dialogFormVisible = !state.dialogFormVisible
      setTimeout(() => {
        loading.value = false
      }, 500)

    }
    //获取角色列表
    const getRoleList = () => {
      getRoles(pageInfo).then(res => {
        if (res.code == 20000) {
          roleList.value = res.data.recordList
          roleList.value.map(item => {
            item.isDisable = item.isDisable == 1 ? false : true
          })
        } else {
          ElMessage({
            message: res.message,
            type: 'success'
          })
        }
      })
    }
    const getBodyWidth = computed(() => {
      state.bodyWidth = store.state.bodyWidth
      return state.bodyWidth
    })
    //修改role状态
    const changeHandle = (data) => {
      let role = JSON.parse(JSON.stringify(data))
      role.isDisable = role.isDisable ? 0 : 1;
      roleStatus(role).then(res => {
        if (res.code == 20000) {
          ElMessage({
            type: 'success',
            message: '操作成功'
          })
        } else {
          ElMessage({
            type: 'error',
            message: res.message
          })
          data.isDisable = !data.isDisable
        }
      })
    }
    return {
      ...toRefs(state),
      addRole,
      delRole,
      selectRole,
      tree,
      defaultProps,
      resourceListIds,
      resourceList,
      updateMenuOrResource,
      doUpdate,
      roleList,
      changeHandle,
      formatDate,
      Check,
      Close,
      pageInfo,
      getBodyWidth,
      loading,
      handleCheckChange,
      searchRole,
      Search,
      roleName,
      pageChange,
      doAddRole,
      selectRoles,
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

.op {
  font-size: 12px;
  color: #409EFF;
}

.op:hover {
  cursor: pointer;
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
.add_form{
  margin: 0 auto;
  width: 90%;
}
</style>
