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
            添加
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
          <span class="op" @click="addResource(scope.row)" v-if="scope.row.parentId == null">
            <el-icon><Plus /></el-icon>
            新增
          </span>
          <span class="op" @click="updateResource(scope.row)">
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
              title="确定要删除该角色吗？"
              @confirm="delResource(scope.row.id,2)"
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
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import {getResource, searchResource, updateResources} from "@/network/resource";
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
    let state = reactive({
      bodyWidth:0,
      loading:true
    })
    const search = () => {
      searchResource(resourceName.value).then(res=>{
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
        }
      })
    }
    //删除资源
    const delResource = (row) => {
      console.log(row)
    }
    const doUpdate = (resource) => {
      resource.isAnonymous = resource.isAnonymous ? 1 : 0
      updateResources(resource).then(res=>{
        if (res.flag){
          search();
        }
      })
    }
    //新增资源
    const addResource = (row) => {
      console.log(row)
    }
    //更新资源
    const updateResource = (row) => {
      console.log(row)
    }
    //更改匿名
    const changeHandle = (resource) => {
      doUpdate(resource)
      console.log(resource)
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
      getResource().then(res=>{
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
      addResource,
      updateResource,
      delResource,
      search,
      resourceName,
      tableData,
      Check,
      Close,
      Search,
      InfoFilled,
      treeTable,
      getBodyWidth,
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
</style>
