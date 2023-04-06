<template>
  <div class="main">
    <div class="pages_contain">
      <div class="el-row">
        <div class="el-col el-col-24 el-col-md-6" v-for="item in pageList">
          <div class="page_item">
            <div class="page_op">
              <el-dropdown>
                <el-icon size="20" color="white"><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item><el-icon><EditPen /></el-icon>编辑</el-dropdown-item>
                    <el-dropdown-item><el-icon><Delete /></el-icon>删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="page_cover">
              <el-image :src="item.pageCover" class="img" />
            </div>
            <div class="page_name">{{ item.pageName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {getPages} from "@/network/page";

export default {
  name: "Page",
  setup(){
    let page = reactive({
      id:0,
      pageName:'',
      pageLabel:'',
      pageCover:'',
    })
    let pageList = ref()
    const getPageList = () => {
      getPages().then(res=>{
        if (res.flag){
          pageList.value = res.data
        }
      })
    }
    onMounted(()=>{
      getPageList()
    })
    return{
      pageList
    }
  }
}
</script>

<style scoped lang="less">
.pages_contain{
  padding: 10px;
  display: flex;
  .page_item{
    position: relative;
    width: 100%;
    .page_op{
      position: absolute;
      z-index: 99;
      top: .3rem;
      right: .6rem;
    }
    .page_cover{
      border-radius: 5px;
      padding-left: 5px;
      padding-right: 5px;
      height: 170px;
      .img{
        width: 100%;
        height: 170px;
        border-radius: 5px;
      }
    }
    .page_name{
      margin: 7px 0 7px 0;
      text-align: center;
      font-size: 18px;
      color: #303133;
    }
  }
}
</style>
