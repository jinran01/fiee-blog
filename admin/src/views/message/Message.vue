<template>
  <div class="message">
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
        <el-button type="danger" @click="openMsgBoxDel" :disabled="flag">
          <template #default v-if="getBodyWidth < 667">
            <el-icon v-if="getBodyWidth < 667">
              <Delete />
            </el-icon>
          </template>
          <template #default>
            <el-icon>
              <Delete/>
            </el-icon>
            批量删除
          </template>
        </el-button>
        <el-button type="success" @click="openMsgBoxRe([],1)" v-if="getBodyWidth > 667" :disabled="flag">
          <template #default>
            <el-icon><Check /></el-icon>
            批量通过
          </template>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-select v-model="reviewType"
                   placeholder="审核状态"
                   v-if="bodyWidth >= 667"
                   style="margin-right: 10px"
                   @change="getTypeHandler"
                   clearable
                   @clear="clearTypeHandler"
        >
          <el-option label="未审核" :value="0" />
          <el-option label="已审核" :value="1" />
        </el-select>
        <el-input
            v-model="nickname"
            placeholder="昵称查询"
            :prefix-icon="Search"
            style="width: 200px;margin-right: 10px"
        />
        <el-button type="primary" :icon="Search" @click="searchMessage"></el-button>
      </el-form-item>
    </form>
    <el-table :data="messageList"
              border
              @selection-change="selectMessages"
              table-layout="fixed">
      <el-table-column type="selection" width="45"/>
      <el-table-column prop="avatar" label="头像" width="65" align="center" >
        <template #default="scope">
          <img :src="scope.row.avatar" width="40" height="40">
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="留言人" width="150" align="center" />
      <el-table-column prop="messageContent" label="留言内容" min-width="200" align="center" />
      <el-table-column prop="ipAddress" label="ip地址" width="140" align="center" />
      <el-table-column prop="ipResource" label="ip来源" width="200" align="center" />
      <el-table-column prop="isReview" label="状态" width="90" align="center">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.isReview == 1">正常</el-tag>
          <el-tag type="danger" v-if="scope.row.isReview == 0">未审核</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="留言时间" width="150" align="center">
        <template #default="scope">
          <el-icon>
            <timer/>
          </el-icon>
          {{ formatDate(scope.row.createTime, "YYYY-MM-dd") }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" :width="getBodyWidth <= 667 ? '160' : ''" align="center">
        <template #default="scope">
          <el-button size="small" type="success" plain v-if="scope.row.isReview == 0" @click="review">
            <el-icon>
              <Check />
            </el-icon>
            通过
          </el-button>
          <el-popconfirm
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              confirm-button-type="danger"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="确定要删除该角色吗？"
              @confirm="doDelMessage(scope.row.id,2)"
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
        @current-change="pageChange"
        :page-size=pageInfo.size
        :total="count"
    />
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import {Search,InfoFilled} from "@element-plus/icons-vue";
import {formatDate} from "@/common/js/formatDate";
import store from "@/store";
import {delMessages, getMessages} from "@/network/message";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "Message",
  setup(){
    let reviewType = ref('')
    let messageList = ref([])
    let nickname = ref('')
    let selectMessagesList = ref([])
    let state = reactive({
      count:0,
      bodyWidth:0,
      flag:true
    })
    let pageInfo = {
      current:1,
      size:10,
      keywords:'',
      isReview:''
    }
    //打开删除留言确认框
    const openMsgBoxDel = () => {
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
        doDelMessage([],1)
      })
    }
    const doDelMessage = (ids,flag) => {
      if (flag == 2){
        selectMessagesList.value = []
        selectMessagesList.value.push(ids)
      }
      delMessages(selectMessagesList.value).then(res=>{
        if (res.flag){
          ElMessage({
            type:'success',
            message:'删除成功'
          })
          getMessageList(pageInfo)
        }
      })
    }
    // //单删
    // const delMessage = (data) => {
    //   let id = data
    //   doDelMessage(id)
    // }
    //打开留言审核确认框
    const openMsgBoxRe = () => {
      ElMessageBox.confirm(
          '确定要进行该操作吗？',
          '确认操作',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {
        //批量确认
        deleteLinks([],1)
      })
    }

    //留言多选
    const selectMessages = (data) => {
      selectMessagesList.value = []
      data.map(item=>{
        selectMessagesList.value.push(item.id)
      })
      if (selectMessagesList.value.length > 0){
        state.flag = false
      }else {
        state.flag = true
      }
    }
    //获取留言状态 已审核 未审核状态
    const getTypeHandler = () => {
      pageInfo.isReview = reviewType.value
      getMessageList(pageInfo)
    }
    const clearTypeHandler = () => {
      pageInfo.isReview = ''
    }
    //查找留言
    const searchMessage = () => {
      pageInfo.keywords = nickname.value
      getMessageList(pageInfo)
    }
    //列表页更改
    const pageChange = (current) => {
      pageInfo.current = current
      getMessageList(pageInfo)
    }
    const getBodyWidth = computed(() => {
      state.bodyWidth = store.state.bodyWidth
      return state.bodyWidth
    })
    //获取留言列表
    const getMessageList = (data) => {
      let obj = {}
      obj.current = data.current
      obj.size = data.size
      obj.keywords = data.keywords
      obj.isReview = data.isReview
      getMessages(obj).then(res=>{
        if (res.flag){
          console.log(res)
          messageList.value = res.data.recordList
          state.count = res.data.count
        }
      })
    }
    onMounted(()=>{
      getMessageList(pageInfo)
    })
    return{
      ...toRefs(state),
      pageChange,
      formatDate,
      searchMessage,
      getTypeHandler,
      clearTypeHandler,
      openMsgBoxDel,
      selectMessages,
      openMsgBoxRe,
      doDelMessage,
      nickname,
      reviewType,
      getBodyWidth,
      InfoFilled,
      Search,
      pageInfo,
      messageList
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
