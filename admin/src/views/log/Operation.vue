<template>
  <div class="main">
    <form class="main_form">
      <!--      <el-date-picker-->
      <!--          v-model="keywords.date"-->
      <!--          type="daterange"-->
      <!--          start-placeholder="开始时间"-->
      <!--          end-placeholder="结束时间"-->
      <!--          @change="getDate"-->
      <!--      />-->
      <el-form-item>
        <el-button type="danger" @click="openMsgBox([],1)" :disabled="getLength">
          <template #default v-if="getBodyWidth < 667">
            <el-icon>
              <Delete/>
            </el-icon>
          </template>
          <template #default v-else>
            <el-icon>
              <Delete/>
            </el-icon>
            批量删除
          </template>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-input
            v-model="keyword"
            placeholder="请输入模块名或操作描述"
            :prefix-icon="Search"
            style="width: 200px;margin-right: 10px"
        />
        <el-button type="primary" :icon="Search" @click="search"></el-button>
      </el-form-item>
    </form>
    <el-table
        :data="tableData"
        row-key="id"
        v-loading="loading"
        @selection-change="selectChange"
    >
      <el-table-column type="selection" width="45"/>
      <el-table-column prop="optModule" label="系统模块" :width="getBodyWidth <= 667 ? '120' : ''" align="center"/>
      <el-table-column prop="optType" label="操作类型" :width="getBodyWidth <= 667 ? '120' : ''" align="center"/>
      <el-table-column prop="optDesc" label="操作描述" :width="getBodyWidth <= 667 ? '200' : ''" align="center"/>
      <el-table-column prop="requestMethod" label="请求方式" :width="getBodyWidth <= 667 ? '90' : ''" align="center">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.requestMethod=='GET'">{{ scope.row.requestMethod }}</el-tag>
          <el-tag type="" v-if="scope.row.requestMethod=='POST'">{{ scope.row.requestMethod }}</el-tag>
          <el-tag type="warning" v-if="scope.row.requestMethod=='PUT'">{{ scope.row.requestMethod }}</el-tag>
          <el-tag type="danger" v-if="scope.row.requestMethod=='DELETE'">{{ scope.row.requestMethod }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="操作人员" :width="getBodyWidth <= 667 ? '90' : ''" align="center"/>
      <el-table-column prop="ipAddress" label="登录Ip" :width="getBodyWidth <= 667 ? '150' : ''" align="center"/>
      <el-table-column prop="ipSource" label="登录地址" align="center" :width="getBodyWidth <= 667 ? '150' : ''"/>
      <el-table-column prop="createTime" label="操作日期" width="200" align="center">
        <template #default="scope">
          <el-icon>
            <timer/>
          </el-icon>
          {{ formatDate(scope.row.createTime, "YYYY-MM-dd hh:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" :width="getBodyWidth < 667 ? '80' : '150'" align="center">
        <template #default="scope">
          <span class="op" @click="catchOperation(scope.row)">
            <el-icon><View/></el-icon>
            查看
          </span>
          <el-popconfirm
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              confirm-button-type="danger"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="确定要删除该操作日志吗？"
              @confirm="delOperation(scope.row.id,0)"
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
    <el-dialog
        v-model="centerDialogVisible"
        :width="getBodyWidth < 667 ? '90%' : '50%'"
    >
      <template #default>
        <div class="content">
          <div class="content_box">
            <div class="content_label">
              <span>操作模块</span>
            </div>
            <div class="content_info">
              {{ operation.optModule }}
            </div>
          </div>
          <div class="content_box">
            <div class="content_label">
              请求地址
            </div>
            <div class="content_info">
              {{ operation.optUrl }}
            </div>
          </div>
          <div class="content_box">
            <div class="content_label">
              <span>请求方式</span>
            </div>
            <div class="">
              <el-tag type="success" v-if="operation.requestMethod=='GET'">{{ operation.requestMethod }}</el-tag>
              <el-tag type="" v-if="operation.requestMethod=='POST'">{{ operation.requestMethod }}</el-tag>
              <el-tag type="warning" v-if="operation.requestMethod=='PUT'">{{ operation.requestMethod }}</el-tag>
              <el-tag type="danger" v-if="operation.requestMethod=='DELETE'">{{ operation.requestMethod }}</el-tag>
            </div>
          </div>
          <div class="content_box">
            <div class="content_label">
              <span>操作方法</span>
            </div>
            <div class="content_info">
              {{ operation.optMethod }}
            </div>
          </div>
          <div class="content_box">
            <div class="content_label">
              请求参数
            </div>
            <div class="content_info">
              {{ operation.requestParam }}
            </div>
          </div>
          <div class="content_box">
            <div class="content_label">
              返回数据
            </div>
            <div class="content_info">
              {{ operation.responseData }}
            </div>
          </div>
          <div class="content_box">
            <div class="content_label">
              操作人员
            </div>
            <div class="content_info">
              {{ operation.nickname }}
            </div>
<!--            <el-tooltip effect="light">-->
<!--              <template #content>-->
<!--                <span>{{ operation.nickname }}</span>-->
<!--              </template>-->
<!--              <div class="content_info">-->
<!--                <span>{{ operation.nickname }}</span>-->
<!--              </div>-->
<!--            </el-tooltip>-->
          </div>
        </div>
      </template>
      <template #header>
        <el-icon>
          <el-icon size="15">
            <Edit/>
          </el-icon>
        </el-icon>
        <span style="font-size: 14px;margin-left: 10px">详细信息</span>
      </template>
    </el-dialog>
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
import {Search, InfoFilled} from "@element-plus/icons-vue/global";
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import store from "@/store";
import {formatDate} from "@/common/js/formatDate";
import {delOperations, getOperations} from "@/network/operation";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "Operation",
  setup() {
    let tableData = ref([])
    let keyword = ref('')
    let operationId = ref([])
    let operation = reactive({
      optModule: '',
      optType: '',
      optUrl: '',
      optMethod: '',
      optDesc: '',
      requestParam: '',
      requestMethod: '',
      responseData: '',
      nickname: '',
    })
    let state = reactive({
      bodyWidth: 0,
      count: 0,
      flag: true,
      centerDialogVisible: false
    })
    let pageInfo = {
      keywords: '',
      current: 1,
      size: 10
    }
    const catchOperation = (row) => {
      operation.optModule = row.optModule
      operation.optType = row.optType
      operation.optUrl = row.optUrl
      operation.optMethod = row.optMethod
      operation.optDesc = row.optDesc
      operation.requestParam = row.requestParam
      operation.requestMethod = row.requestMethod
      operation.nickname = row.nickname
      operation.responseData = row.responseData
      state.centerDialogVisible = !state.centerDialogVisible
    }
    //批量删除确认框
    const openMsgBox = (arr, flag) => {
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
            delOperation(arr, flag)
          })
          .catch(() => {
            ElMessage({
              type: 'warning',
              message: '取消删除操作',
            })
          })
    }
    const getLength = computed(() => {
      return operationId.value.length > 0 ? false : true
    })
    //批量选择删除操作日志
    const selectChange = (rows) => {
      operationId.value = []
      rows.map(item => {
        operationId.value.push(item.id)
      })
    }
    //删除操作日志
    const delOperation = (ids, flag) => {
      let deleteIds = reactive([])
      if (flag == 0) {
        deleteIds.push(ids)
      } else {
        deleteIds = operationId.value
      }
      delOperations(deleteIds).then(res => {
        if (res.flag) {
          ElMessage({
            type: 'success',
            message: '操作成功'
          })
          getOperation()
        } else {
          ElMessage({
            type: 'error',
            message: '操作失败，' + res.message
          })
        }
      })
    }
    const pageChange = (current) => {
      pageInfo.current = current
      getOperation()
    }
    onMounted(() => {
      getOperation()
    })
    //获取操作日志
    const getOperation = () => {
      getOperations(pageInfo).then(res => {
        if (res.flag) {
          tableData.value = res.data.recordList
          state.count = res.data.count
        }
      })
    }
    const search = () => {
      pageInfo.keywords = keyword.value
      getOperation()
    }
    //计算body宽度
    const getBodyWidth = computed(() => {
      state.bodyWidth = store.state.bodyWidth
      return state.bodyWidth
    })
    return {
      ...toRefs(state),
      Search,
      keyword,
      getBodyWidth,
      InfoFilled,
      tableData,
      pageInfo,
      operationId,
      getLength,
      operation,
      catchOperation,
      openMsgBox,
      selectChange,
      delOperation,
      search,
      pageChange,
      formatDate,
      getOperation,

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

.el-pagination {
  float: right;
  padding: 10px;
}
.content{
  width: 100%;
  //display: flex;
  .content_box{
    width: 100%;
    display: flex;
    margin-bottom: 20px;
    .content_label{
      min-width: 80px;
      font-size: 14px;
      color: #454545;
    }
    .content_info{
      overflow: hidden;
      overflow-wrap: break-word;
      span{
        word-break:normal;
        display:block;
        white-space:pre-wrap;
        word-wrap : break-word ;
        overflow: hidden ;
        font-size: 12px;
        color: #454545;
        overflow-wrap: break-word;
      }
    }
  }
}
</style>
