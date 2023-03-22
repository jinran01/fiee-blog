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
            v-model="menuName"
            placeholder="菜单查询"
            :prefix-icon="Search"
            style="width: 200px;margin-right: 10px"
        />
        <el-button type="primary" :icon="Search" @click="searchMenu"></el-button>
      </el-form-item>
    </form>
    <el-table
        ref="treeTable"
        :data="menuList"
        row-key="id"
        @row-click="clickRowHandle"
        v-loading="loading"
    >
      <el-table-column prop="name" label="菜单名称" width="140"/>
      <el-table-column prop="icon" label="图标" width="100" align="center">
        <template #default="scope">
          <el-icon>
            <i class="iconfont" :class="scope.row.icon"></i>
          </el-icon>
        </template>
      </el-table-column >
      <el-table-column prop="orderNum" label="排序" width="140" align="center">
        <template #default="scope">
          {{scope.row.orderNum}}
        </template>
      </el-table-column>
      <el-table-column prop="path" label="访问路径" width="180">
        <template #default="scope">
          {{scope.row.path}}
        </template>
      </el-table-column>
      <el-table-column prop="component" label="组件路径" width="180">
        <template #default="scope">
          {{scope.row.component}}
        </template>
      </el-table-column>
      <el-table-column prop="isHidden" label="隐藏" align="center">
        <template #default="scope">
          <el-switch
              v-model="scope.row.isHidden"
              @change="changeHandle(scope.row.id)"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
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
      <el-table-column label="操作" fixed="right" :width="getBodyWidth <= 667 ? '170' : ''">
        <template #default="scope">
          <span class="op" @click="addMenu(scope.row)" v-if="scope.row.parentId == 0">
            <el-icon><Plus/></el-icon>
            新增
          </span>
          <span class="op" @click="updateMenu(scope.row)">
            <el-icon><EditPen/></el-icon>
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
              @confirm="delMenu(scope.row.id)"
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
import {getMenuList} from "@/network/menu";
import store from "@/store";
import {InfoFilled,Search,Check,Close} from "@element-plus/icons-vue";
import {formatDate} from "@/common/js/formatDate";

export default {
  name: "Menu",
  setup() {
    let menuList = ref([]) //菜单资源
    let treeTable = ref(null) //table对象
    let menuName = ref('') //查询菜单名称
    let state = reactive({
      bodyWidth:0,
      loading:true,
    })
    //修改菜单隐藏状态
    const changeHandle = (row) => {
      // console.log(row)
    }
    onMounted(() => {
      getMenus();
    })
    //计算body宽度
    const getBodyWidth = computed(()=>{
      state.bodyWidth = store.state.bodyWidth
      return state.bodyWidth
    })
    const getMenus = () => {
      if (JSON.parse(localStorage.getItem('menuList')).length > 0){
        menuList.value = JSON.parse(localStorage.getItem('menuList'))
      }else {
        getMenuList().then(res => {
          menuList.value = res.data
        })
      }
      menuList.value.map(item=>{
        item.isHidden = item.isHidden == 0 ? false : true
        if (item.children.length > 0){
          item.children.map(i=>{
            i.isHidden = i.isHidden == 0 ? false : true
          })
        }
      })
      state.loading=false
    }
    //点击行展开
    const clickRowHandle = (row) => {
      treeTable.value.toggleRowExpansion(row);
    }
    return {
      ...toRefs(state),
      menuList,
      treeTable,
      getBodyWidth,
      InfoFilled,
      Search,
      Check,
      Close,
      menuName,
      changeHandle,
      formatDate,
      clickRowHandle,
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
