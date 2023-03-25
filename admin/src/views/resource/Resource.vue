<template>
  <div class="main" >
    <form class="main_form">
      <!--      <el-date-picker-->
      <!--          v-model="keywords.date"-->
      <!--          type="daterange"-->
      <!--          start-placeholder="开始时间"-->
      <!--          end-placeholder="结束时间"-->
      <!--          @change="getDate"-->
      <!--      />-->
      <el-form-item>
        <el-button type="primary" @click="addModel">
          <template #default v-if="getBodyWidth < 667">
            <el-icon>
              <Plus/>
            </el-icon>
          </template>
          <template #default v-else>
            <el-icon>
              <Plus/>
            </el-icon>
            添加模块
          </template>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-input
            v-model="resourceName"
            placeholder="资源查询"
            :prefix-icon="Search"
            style="width: 200px;margin-right: 10px"
        />
        <el-button type="primary" :icon="Search" @click="search"></el-button>
      </el-form-item>
    </form>
    <el-table
        ref="treeTable"
        :data="tableData"
        row-key="id"
        @row-click="clickRowHandle"
        v-loading="loading"
    >
      <el-table-column prop="resourceName" label="资源名" :width="getBodyWidth <= 667 ? '200' : ''" />
      <el-table-column prop="url" label="资源路径" :width="getBodyWidth <= 667 ? '200' : ''" />
      <el-table-column prop="requestMethod" label="请求方式"  :width="getBodyWidth <= 667 ? '90' : ''">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.parentId!=null && scope.row.requestMethod=='GET'">{{ scope.row.requestMethod }}</el-tag>
          <el-tag type="" v-if="scope.row.parentId!=null && scope.row.requestMethod=='POST'">{{ scope.row.requestMethod }}</el-tag>
          <el-tag type="warning" v-if="scope.row.parentId!=null && scope.row.requestMethod=='PUT'">{{ scope.row.requestMethod }}</el-tag>
          <el-tag type="danger" v-if="scope.row.parentId!=null && scope.row.requestMethod=='DELETE'">{{ scope.row.requestMethod }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isAnonymous" label="匿名访问" :width="getBodyWidth <= 667 ? '90' : ''">
        <template #default="scope">
          <el-switch
              v-model="scope.row.isAnonymous"
              @change="changeHandle(scope.row)"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
              :disabled="scope.row.parentId == null"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="130">
        <template #default="scope">
          <el-icon>
            <timer/>
          </el-icon>
          {{ formatDate(scope.row.createTime, "YYYY-MM-dd") }}
        </template>
      </el-table-column>
      <el-table-column  label="操作"  fixed="right" :width="getBodyWidth <= 667 ? '170' : ''">
        <template #default="scope">
          <span class="op" @click="updateResource(scope.row)" v-if="scope.row.parentId == null">
            <el-icon><Plus /></el-icon>
            新增
          </span>
          <span class="op" @click="scope.row.parentId == null ? addModel(scope.row) : updateResource(scope.row)">
            <el-icon><EditPen /></el-icon>
            修改
          </span>
          <el-popconfirm
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              confirm-button-type="danger"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="确定要删除该资源吗？"
              @confirm="delResource(scope.row.id)"
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
    <!-- 添加/修改模块 -->
    <el-dialog v-model="dialogFormVisible_add" destroy-on-close :width="getBodyWidth < 667 ? '90%' : '50%'">
      <template #header>
        <el-icon>
          <el-icon size="15">
            <Plus />
          </el-icon>
        </el-icon>
        <span style="font-size: 14px;margin-left: 10px">{{flag_model==0 ? '新增模块' : '修改模块'}}</span>
      </template>
      <el-form :model="add_form" >
        <el-form-item label="模块名" >
          <el-input v-model="add_form.resourceName" autocomplete="off"  />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible_add = false">取消</el-button>
        <el-button type="primary" @click="doAddModel">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>
    <!-- 添加/修改资源 -->
    <el-dialog v-model="dialogFormVisible_add_res" destroy-on-close :width="getBodyWidth < 667 ? '90%' : '50%'">
      <template #header>
        <el-icon>
          <el-icon size="15">
            <Plus />
          </el-icon>
        </el-icon>
        <span style="font-size: 14px;margin-left: 10px">{{ flag_res == 0 ? '新增资源' : '修改资源' }}</span>
      </template>
      <el-form :model="add_res_form" >
        <el-form-item label="资 源 名" >
          <el-input v-model="add_res_form.resourceName" autocomplete="off"  />
        </el-form-item>
        <el-form-item label="资源路径" >
          <el-input v-model="add_res_form.url" autocomplete="off"  />
        </el-form-item>
        <el-form-item label="请求方式" >
          <el-radio-group v-model="add_res_form.requestMethod">
            <el-radio label="GET">GET</el-radio>
            <el-radio label="POST">POST</el-radio>
            <el-radio label="PUT">PUT</el-radio>
            <el-radio label="DELETE">DELETE</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible_add_res = false">取消</el-button>
        <el-button type="primary" @click="doAddResource">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import {delResources, getResource, updateResources} from "@/network/resource";
import {ElMessage} from "element-plus";
import {Check, Close,InfoFilled,Search} from "@element-plus/icons-vue";
import {formatDate} from "@/common/js/formatDate";
import store from "@/store";

export default {
  name: "Resource",
  setup(){
    let tableData = ref([]) //资源数据
    let treeTable = ref(null) //table对象
    let resourceName = ref('') //查询资源名称
    let resource = reactive({})
    let state = reactive({
      bodyWidth:0,
      loading:true,
      dialogFormVisible_add:false, //添加/修改模块的dialog
      dialogFormVisible_add_res:false, //添加/修改资源的dialog
      flag_model:0, //新增/修改模块标志 0为新增 1为修改
      flag_res:0 //新增/修改资源标志 0为新增 1为修改
    })
    let add_form = reactive({
      resourceName:''
    })
    let add_res_form = reactive({
      resourceName:'',
      requestMethod:'',
      url:'',
      id:'',
      parentId:''
    })
    //查找资源
    const search = () => {
      getResourceData();
    }
    //删除资源
    const delResource = (id) => {
      delResources(id).then(res=>{
        if (res.flag){
          ElMessage({
            type:'success',
            message:'删除成功'
          })
          getResourceData();
        }else {
          ElMessage({
            type:'error',
            message:res.message
          })
        }
      })
    }
    //执行更新操作
    const doUpdate = (resource) => {
      updateResources(resource).then(res=>{
        if (res.flag){
          ElMessage({
            type:'success',
            message:'操作成功'
          })
          getResourceData();
        }
      })
    }
    //执行 添加/修改 模块操作
    const doAddModel = () => {
      //判断是否为修改
      if (state.flag_model == 0){
        //新增
        doUpdate(add_form)
      }else {
        //修改
        resource.resourceName = add_form.resourceName
        console.log(resource)
        // console.log(resource)
        doUpdate(resource)
      }
      getResourceData()
      state.dialogFormVisible_add = !state.dialogFormVisible_add
    }
    //新增/修改模块
    const addModel = (row) => {
      resource = {}
      add_form.resourceName = ''
      state.flag_model = 0
      //判断是否为修改
      if (row.id != null){
        state.flag_model = 1
        resource['isAnonymous'] = row.isAnonymous ? 1 : 0
        resource['resourceName'] = row.resourceName
        resource['id'] = row.id
        resource['parentId'] = row.parentId
        resource['url'] = row.url
        add_form.resourceName = row.resourceName
      }
      state.dialogFormVisible_add = !state.dialogFormVisible_add
    }
    //执行 添加/修改 资源操作
    const doAddResource = () => {
      //判断是否为修改
      if (state.flag_res == 0){
        //新增
        let resource = {
          resourceName:add_res_form.resourceName,
          requestMethod:add_res_form.requestMethod,
          url:add_res_form.url,
          parentId : add_res_form.parentId
        }
        doUpdate(resource)
      }else {
        //修改
        doUpdate(add_res_form)
      }
      getResourceData()
      state.dialogFormVisible_add_res = !state.dialogFormVisible_add_res
    }
    //更新/新增资源
    const updateResource = (row) => {
      //设置为空
      add_res_form.resourceName = ''
      add_res_form.url = ''
      add_res_form.requestMethod = ''
      add_res_form.id = ''
      add_res_form.parentId = ''
      state.flag_res = 0
      //判断是否为修改
      // console.log(row.parentId == null)
      if (row.parentId != null){
        //修改
        state.flag_res = 1
        add_res_form.resourceName = row.resourceName
        add_res_form.url = row.url
        add_res_form.requestMethod = row.requestMethod
        add_res_form.id = row.id
        add_res_form.parentId = row.parentId
      }else {
        add_res_form.parentId = row.id
      }
      state.dialogFormVisible_add_res = !state.dialogFormVisible_add_res
    }
    //更改匿名
    const changeHandle = (resource) => {
      resource.isAnonymous = resource.isAnonymous ? 1 : 0
      doUpdate(resource)
    }
    //计算body宽度
    const getBodyWidth = computed(()=>{
      state.bodyWidth = store.state.bodyWidth
      return state.bodyWidth
    })
    onMounted(()=>{
      getResourceData();
    })
    //获取资源数据
    const getResourceData = () => {
      getResource(resourceName.value).then(res=>{
        if (res.flag){
          tableData.value = res.data
          tableData.value.map(item=>{
            item.isAnonymous = item.isAnonymous == 0 ? false : true
            if (item.children.length > 0){
              item.children.map(i=>{
                i.isAnonymous = i.isAnonymous == 0 ? false : true
              })
            }
          })
          state.loading = false
        }else {
          ElMessage({
            type:'error',
            message:'出错了'
          })
        }
      })
    }
    //点击行展开
    const clickRowHandle = (row) => {
      treeTable.value.toggleRowExpansion(row);
    }
    return{
      ...toRefs(state),
      getResourceData,
      changeHandle,
      formatDate,
      clickRowHandle,
      // addResource,
      updateResource,
      doAddResource,
      delResource,
      search,
      addModel,
      doAddModel,
      add_res_form,
      resourceName,
      tableData,
      Check,
      Close,
      Search,
      InfoFilled,
      treeTable,
      getBodyWidth,
      add_form
    }
  }

}
</script>

<style scoped lang="less">
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
.el-dialog{
  form{
    width: 80%;
    margin: 0 auto;
  }
}
</style>
