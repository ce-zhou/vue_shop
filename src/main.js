import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import vueRouter from 'vue-router'
// 引入创建的路由
import router from './router'

// 导入全局样式表
import './assets/css/global.css'

// 引入字体库
import './assets/font/iconfont.css'

// 配置全局的axios
import axios from 'axios'
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 应用vue-router
Vue.use(vueRouter)

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')

