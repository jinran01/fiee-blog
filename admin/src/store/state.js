
const state = {
  tabList:[{name:'首页',path:'/'}],
  //body的宽度
  bodyWidth:document.body.clientWidth,
  menuList:[],
  LOGIN_FLAG:false,
  userInfo:JSON.parse(localStorage.getItem("userInfo")) || '',
  isLogin:window.localStorage.getItem("userInfo") ? true : false
}
export default state;
