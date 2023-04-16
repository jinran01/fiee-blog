import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import "@/assets/css/global/index.css"
import "./assets/css/iconfont.css";
import "./assets/css/markdown.css";
import "./assets/css/vue-social-share/client.css";
import "highlight.js/styles/atom-one-dark.css";

//引入element
import ElementPlus from 'element-plus';
// import 'lib-flexible/flexible';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn'



// import { loadFonts } from './plugins/webfontloader'
// loadFonts()
const app = createApp(App)
app.use(router)
    .use(store)
    .use(vuetify)
    .use(ElementPlus,{locale})
    .mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
