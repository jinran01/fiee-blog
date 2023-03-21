import {getMenuList} from "@/network/menu";

const actions = {
  async setMenu({commit}){
    await getMenuList().then(res=>{
      commit('setMenu',res.data)
    })
  }
}
export default actions;
