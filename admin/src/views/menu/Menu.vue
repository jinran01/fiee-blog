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
        <el-button type="primary" @click="addMenu(this,0)">
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
      <el-table-column prop="component" label="组件路径" width="200">
        <template #default="scope">
          {{scope.row.component}}
        </template>
      </el-table-column>
      <el-table-column prop="isHidden" label="隐藏" align="center">
        <template #default="scope">
          <el-switch
              v-model="scope.row.isHidden"
              @change="changeHandle(scope.row)"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
              :disabled="scope.row.parentId == 0 && scope.row.children.length != 0"
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
          <span class="op" @click="addMenu(scope.row,3)" v-if="scope.row.parentId == 0 && scope.row.component == 'Layout'" >
            <el-icon><Plus/></el-icon>
            新增
          </span>
          <span class="op" @click="addMenu(scope.row,1)">
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
              @confirm="doDelMenu(scope.row.id)"
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
    <!-- 添加/修改资源 -->
    <el-dialog v-model="dialogFormVisible" destroy-on-close :width="getBodyWidth < 667 ? '90%' : '50%'">
      <template #header>
        <el-icon>
          <el-icon size="15" v-if="flag_menu == 1">
            <Edit />
          </el-icon>
          <el-icon size="15" v-else>
            <Plus />
          </el-icon>
        </el-icon>
        <span style="font-size: 14px;margin-left: 10px">{{flag_menu == 0 ? '新增菜单' : '修改菜单'}}</span>
      </template>
      <el-form :model="form" >
        <el-form-item label="菜单名称" >
          <el-input v-model="form.name" autocomplete="off"  />
        </el-form-item>
        <el-form-item label="组件路径" >
          <el-input v-model="form.component" autocomplete="off"  />
        </el-form-item>
        <el-form-item label="访问路径" >
          <el-input v-model="form.path" autocomplete="off"  />
        </el-form-item>
        <el-form-item label="菜单图标" >
          <el-dropdown max-height="140" @visible-change="getIcons">
            <el-input v-model="form.icon" autocomplete="off" >
              <template #prefix>
                <el-icon>
                  <i class="iconfont" :class="form.icon"></i>
                </el-icon>
              </template>
            </el-input>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(item) in icons" @click="form.icon = 'icon-'+item.font_class">
                  <template #default>
                    <el-icon>
                      <i class="iconfont" :class="'icon-'+item.font_class"></i>
                    </el-icon>
                    {{ item.name }}
                  </template>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="显示排序" >
          <el-input-number v-model="form.orderNum" :min="1" :max="10" />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="doAddMenu">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import {delMenu, getMenuList, updateMenu} from "@/network/menu";
import store from "@/store";
import {InfoFilled,Search,Check,Close} from "@element-plus/icons-vue";
import {formatDate} from "@/common/js/formatDate";
import {ElMessage} from "element-plus";
import {glyphs} from "@/common/icons/menu_icons";

export default {
  name: "Menu",
  setup() {
    let menuList = ref([]) //菜单资源
    let treeTable = ref(null) //table对象
    let menuName = ref('') //查询菜单名称
    let icons = ref([])
    let state = reactive({
      bodyWidth:0,
      loading:true,
      flag_menu:0, // 1为修改 0为新增 3为新增子菜单
      dialogFormVisible:false,
    })
    let form = reactive({
      id:0,
      parentId:'',
      name:'',
      orderNum:0,
      path:'',
      component:'',
      icon:'',
    })
    const doDelMenu = (id) => {
      delMenu(id).then(res=>{
        if (res.flag){
          ElMessage({
            showClose: true,
            message: '成功删除',
            type: 'success',
          })
          store.dispatch("setMenu")
          setTimeout(()=>{
            getMenus()
          },500)
        }else {
          ElMessage({
            showClose: true,
            message: '删除失败，'+res.message,
            type: 'error',
          })
        }
      })
    }
    //执行更新或新增菜单操作
    const doAddMenu = () => {
      //新增
      if (state.flag_menu==0){
        //新增
        let data = {}
        data.parentId = 0
        data.path = form.path
        data.name = form.name
        data.orderNum = form.orderNum
        data.icon = form.icon
        data.component = form.component
        update(data)
        state.dialogFormVisible = !state.dialogFormVisible
      }else if (state.flag_menu == 1){
        //修改
        let data = {}
        data.id = form.id
        data.parentId = form.parentId
        data.path = form.path
        data.name = form.name
        data.orderNum = form.orderNum
        data.icon = form.icon
        data.component = form.component
        update(data)
        state.dialogFormVisible = !state.dialogFormVisible
      }else {
        //新增子菜单
        let data = {}
        data.parentId = form.id
        data.path = form.path
        data.name = form.name
        data.orderNum = form.orderNum
        data.icon = form.icon
        data.component = form.component
        update(data)
        state.dialogFormVisible = !state.dialogFormVisible
      }
    }
    const getIcons = () => {
      icons.value = glyphs
    }
    //查询菜单
    const searchMenu = () => {
      // getMenus();
      getMenuList(menuName.value).then(res=>{
        if (res.flag){
          menuList.value = res.data
          // menuList.value.map(item=>{
          //   item.isHidden = item.isHidden == 0 ? false : true
          //   if (item.children.length > 0){
          //     item.children.map(i=>{
          //       i.isHidden = i.isHidden == 0 ? false : true
          //     })
          //   }
          // })
          resetValue(menuList.value)
        }
      })
    }
    const resetValue = (data) => {
      data.map(item=>{
        item.isHidden = item.isHidden == 0 ? false : true
        if (item.children.length > 0){
          item.children.map(i=>{
            i.isHidden = i.isHidden == 0 ? false : true
          })
        }
      })
    }
    //增加菜单
    const addMenu = (row,flag) => {
      form.icon = ''
      form.name = ''
      form.path = ''
      form.orderNum = 0
      form.component = ''
      state.flag_menu = 0
      if (flag == 1){
        //是否为修改
        if (row.id != null ){
          form.id = row.id
          form.icon = row.icon
          form.name = row.name
          form.path = row.path
          form.orderNum = row.orderNum
          form.component = row.component
          form.parentId = row.parentId
          state.flag_menu = 1
        }
      }
      if (flag == 3){
        form.id = row.id
        state.flag_menu = 3
      }
      state.dialogFormVisible = !state.dialogFormVisible
    }
    //修改菜单隐藏状态
    const changeHandle = (row) => {
      row.isHidden = row.isHidden ? 1 : 0
      update(row)
    }
    //执行 更新/新增 菜单操作
    const update = (row) => {
      updateMenu(row).then(res=>{
        if (res.flag){
          ElMessage({
            showClose: true,
            message: '修改成功',
            type: 'success',
          })
          store.dispatch("setMenu")
          setTimeout(()=>{
            getMenus()
          },500)
        }else {
          ElMessage({
            showClose: true,
            message: '修改失败',
            type: 'error',
          })
        }
      });
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
        getMenuList(menuName.value).then(res => {
          menuList.value = res.data
        })
      }
      resetValue(menuList.value)
      // menuList.value.map(item=>{
      //   item.isHidden = item.isHidden == 0 ? false : true
      //   if (item.children.length > 0){
      //     item.children.map(i=>{
      //       i.isHidden = i.isHidden == 0 ? false : true
      //     })
      //   }
      // })
      state.loading=false
    }
    //点击行展开
    const clickRowHandle = (row) => {
      treeTable.value.toggleRowExpansion(row);
    }
    return {
      ...toRefs(state),
      icons,
      menuList,
      treeTable,
      getBodyWidth,
      InfoFilled,
      Search,
      Check,
      Close,
      menuName,
      form,
      doDelMenu,
      // getIcon,
      doAddMenu,
      getIcons,
      addMenu,
      searchMenu,
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
  //display: block;
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
