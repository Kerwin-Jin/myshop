import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import '@/assets/css/global.css'
import '@/assets/fonts/iconfont.css'
import axios from 'axios'

// 引入第三方组件库
import TreeTable from 'vue-table-with-tree-grid'

//配置axios请求的根路径
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
// 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
//将axos挂到Vue的原型对象上，在其他组件中就可以用this.$http来使用axios了
Vue.prototype.$http = axios

Vue.config.productionTip = false

//注册全局组件
Vue.component('tree-table',TreeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
