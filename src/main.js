import Vue from "vue";
import App from "./App.vue";
import "./plugins/element.js";
import vueRouter from "vue-router";
// 引入创建的路由
import router from "./router";

// 导入全局样式表
import "./assets/css/global.css";

// 引入字体库
import "./assets/font/iconfont.css";

// 全局引入tree-table
import treeTable from "vue-table-with-tree-grid";

// 配置全局的axios
import axios from "axios";

// 引入vue-quill-editor
import vueQuillEditor from "vue-quill-editor";
// 导入对应的样式
import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme

// 配置请求根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1";
// 通过axios请求拦截器添加token
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

Vue.component("tree-table", treeTable);

// 应用vue-router
Vue.use(vueRouter);

import dayjs from "dayjs";

// 定义全局过滤器
Vue.filter("dateFormat", function (originVal) {
  return dayjs(originVal).format("YYYY-MM-DD HH:mm:ss");
});

Vue.use(vueQuillEditor);

new Vue({
  render: (h) => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this; //安装全局事件总线
  },
  router,
}).$mount("#app");
