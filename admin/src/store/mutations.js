
const mutations = {
  addTab(state, payload) {
    let flag = false;
    for (let i = 0; i < state.tabList.length; i++) {
      if (state.tabList[i].name == payload.name || payload.name == 'Home') {
        flag = true
        break;
      }
    }
    if (!flag) {
      state.tabList.push(payload)
    }
  },
  removeTab(state, payload) {
    state.tabList.splice(payload, 1);
  },
  resetTab(state){
    state.tabList=[{name:'首页',path:'/'}]
  },
  setMenu(state, data) {
    state.menuList = data
    localStorage.setItem("menuList",JSON.stringify(data))
  },
  setUserInfo(state,data){
    state.userInfo = data
  },
  setLogin(state,payload){
    state.isLogin = payload
  }
}
export default mutations
