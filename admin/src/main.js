import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入element
import ElementPlus from 'element-plus';
import 'lib-flexible/flexible';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn'
import * as echarts from './utils/echarts'

//引入icon css
import './assets/icons/blogicon/iconfont.css'
import './assets/css/global.less'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const app = createApp(App)
app.config.globalProperties.$echarts = echarts
app.use(ElementPlus,{locale}).use(mavonEditor)
    .use(store).use(router)
    .mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}



