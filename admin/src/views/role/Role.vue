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
        <el-button type="danger" @click="openMsgBox([],1)" v-if="getBodyWidth >= 667" :disabled="flag">
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
      <el-table-column prop="createTime" label="创建时间" width="200" align="center">
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
          <el-popconfirm
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              confirm-button-type="danger"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="确定要删除该角色吗？"
              @confirm="delRole(scope.row.id,2)"
          >
            <template #reference>
              <span class="op">
                <el-icon><Delete/></el-icon>
                删除
              </span>
            </template>
          </el-popconfirm>
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
          <el-icon size="15">
            <EditPen/>
          </el-icon>
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
          <el-icon size="15">
            <User/>
          </el-icon>
        </el-icon>
        <span style="font-size: 14px;margin-left: 10px">新增角色</span>
      </template>
      <el-form class="add_form">
        <el-form-item label="角 色 名">
          <el-input v-model="role.roleName"
                    placeholder="请输入角色名 如：管理员"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="角色标签">
          <el-input v-model="role.roleLabel"
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
import {addRoles, delRoles, getRoles, roleStatus, updateMenus, updateResources} from "@/network/role";
import {computed, onMounted, reactive, ref, toRefs, watch} from "vue";
import {ElMessage, ElMessageBox, ElTree} from "element-plus";
import {formatDate} from "@/common/js/formatDate";
import {Check, Close, Search, InfoFilled} from "@element-plus/icons-vue";
import store from "@/store";
import {getResource} from "@/network/resource";


export default {
  name: "Role",
  setup() {
    let ids_menu = [2, 3, 4, 19, 202, 205, 213, 215] //根menu的Id
    let ids_resource = [165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180]
    let roleList = ref([])  //获取角色列表
    let selectRoles = reactive([]) //选择的角色
    let resourceList = ref([])  //获取的菜单或资源列表
    let resourceListIds = ref([]) //角色已拥有的菜单或资源列表
    let loading = ref(true) //加载flag
    let roleName = ref('')
    let selectResourceIds = ref([])  //选择赋予的权限列表id
    let tree = ref(null) //获取 tree 对象
    let state = reactive({
      dialogFormVisible: false, //显示修改角色资源的dialog
      dialogFormVisible_add: false, //显示添加角色的dialog
      bodyWidth: 0,// body宽度
      count: 0, //用户总条数
      flag: true, //删除按钮是否可用
      op: '', //修改菜单权限还是资源权限 1为菜单 2为资源
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
    //新增角色的信息
    let role = reactive({
      roleId:0,
      roleName: '',
      roleLabel: '',
    })
    onMounted(() => {
      getRoleList();
    })
    //批量删除确认框
    const openMsgBox = (arr,flag) => {
      ElMessageBox.confirm(
          '确定要删除吗？',
          '确认删除',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            delRole(arr,flag)
          })
          .catch(() => {
            ElMessage({
              type: 'warning',
              message: '取消删除操作',
            })
          })
    }
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
      }
      //将选择的菜单列表赋予 selectResourceIds
      selectResourceIds.value = menuIds
    }
    const selectRole = (select) => {
      selectRoles = []
      select.map(item => {
        selectRoles.push(item.id)
      })
      if (selectRoles.length == 0) {
        state.flag = true
      } else {
        state.flag = false
      }
    }

    //删除角色
    const delRole = (selectIds, flag) => {
      //批量删除
      // if (flag == 1){
      //   console.log(selectRoles)
      // }
      //单删
      if (flag == 2) {
        selectRoles = []
        selectRoles.push(selectIds)
      }
      if (selectRoles.length == 0) {
        ElMessage({
          type: 'error',
          message: '请选择要删除的角色'
        })
      } else {
        //执行删除操作
        delRoles(selectRoles).then(res => {
          if (res.flag) {
            ElMessage({
              type: 'success',
              message: '删除成功'
            })
            getRoleList();
          } else {
            ElMessage({
              type: 'error',
              message: '删除失败，' + res.message
            })
          }
        })
      }
    }
    //添加角色
    const addRole = () => {
      // console.log(parasJson("["+"{'name':'111'}"+","+"{'id':'123'}"+"]"));
      // console.log(localStorage.getItem('menuList'))
      selectResourceIds.value = []
      role.roleLabel = ''
      role.roleName = ''
      resourceList.value = JSON.parse(localStorage.getItem('menuList'))
      state.dialogFormVisible_add = !state.dialogFormVisible_add
    }
    //执行添加角色操作
    const doAddRole = () => {
      let data = {
        role: role,
        menuIds: selectResourceIds.value
      }
      addRoles(data).then(res => {
        if (res.flag) {
          ElMessage({
            type: 'success',
            message: '添加成功'
          })
          getRoleList();
        } else {
          ElMessage({
            type: 'error',
            message: '添加失败，' + res.message
          })
        }
        state.dialogFormVisible_add = !state.dialogFormVisible_add
      })
    }
    //执行修改角色操作
    const doUpdate = () => {
      //执行角色菜单权限更新
      if (state.op == 1) {
        if (selectResourceIds.value.length > 0){
          let data = {
            roleId:role.roleId,
            resourceIds:selectResourceIds.value
          }
          updateMenus(data).then(res=>{
            if (res.flag){
              ElMessage({
                type: 'success',
                message: '角色菜单更新成功'
              })
              getRoleList();
              state.dialogFormVisible = !state.dialogFormVisible
            }else {
              ElMessage({
                type: 'error',
                message: '操作失败'
              })
            }
          })
        }else {
          ElMessage({
            type:'error',
            message:'未有修改'
          })
        }
      }
      //执行角色资源权限更新
      if (state.op == 2) {
        if (selectResourceIds.value.length > 0){
          let data = {
            roleId:role.roleId,
            resourceIds:selectResourceIds.value
          }
          updateResources(data).then(res=>{
            if (res.flag){
              ElMessage({
                type: 'success',
                message: '角色资源更新成功'
              })
              getRoleList();
              state.dialogFormVisible = !state.dialogFormVisible
            }else {
              ElMessage({
                type: 'error',
                message: '操作失败'
              })
            }
          })
        }else {
          ElMessage({
            type:'error',
            massage:'未有修改'
          })
        }
      }
    }
    const pageChange = (current) => {
      pageInfo.current = current
      getRoleList();
    }
    //修改角色菜单或者资源
    const updateMenuOrResource = (data, flag) => {
      role.roleId = data.id
      selectResourceIds.value = []
      state.op = flag
      defaultProps.label = 'name'
      //角色菜单修改
      if (flag == 1) {
        resourceListIds.value = []
        loading.value = true
        resourceList.value = JSON.parse(localStorage.getItem('menuList'))
        data.menuIdList.map(item => {
          //除去根menu的Id
          if (ids_menu.indexOf(item) < 0) {
            resourceListIds.value.push(item)
          }
        })
        // selectResourceIds.value = resourceListIds.value
      }
      //角色资源修改
      if (flag == 2) {
        defaultProps.label = 'resourceName'
        resourceListIds.value = []
        loading.value = true
        getResource().then(res => {
          resourceList.value = res.data
        })
        data.resourceIdList.map(item => {
          //去除根资源id
          if (ids_resource.indexOf(item) < 0) {
            resourceListIds.value.push(item)
          }
        })
        // selectResourceIds.value = resourceListIds.value
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
            type: 'error'
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
      openMsgBox,
      role,
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
      InfoFilled
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

.add_form {
  margin: 0 auto;
  width: 90%;
}
</style>
