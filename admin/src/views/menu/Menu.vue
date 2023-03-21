<template>
  <el-tree :data="menuList" node-key="id" :props="defaultProps" @check="handleNodeClick" show-checkbox @check-change="handleCheckChange"/>
</template>

<script>
import {onMounted, ref} from "vue";
import {getMenuList} from "@/network/menu";

export default {
  name: "Menu",
  setup(){
    let menuList = ref([])
    onMounted(()=>{
      getMenuList().then(res =>{
        console.log(res.data)
        menuList.value = res.data
      })
    })
    const defaultProps = {
      children: 'children',
      label: 'name',
    }
    function handleNodeClick(obj,a){
      console.log(a.checkedKeys);
      console.log(obj)
    }
    const handleCheckChange = (data,checked,indeterminate) => {
      console.log(data, checked, indeterminate,data.getCheckedKeys)
    }
    return{
      menuList,
      defaultProps,
      handleNodeClick,
      handleCheckChange
    }
  }
}
</script>

<style scoped lang="less">

</style>
