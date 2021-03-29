import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 深拷贝依赖
import Lodash from 'lodash'
Vue.use(Lodash)
Vue.use(VueQuillEditor)
// 配置根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)

// 全局时间过滤器
Vue.filter('dataFilter', function (val) {
  // 创建日期对象
  const data = new Date(val)
  // 获取年月日
  const y = data.getFullYear()
  let m = data.getMonth() + 1
  let d = data.getDate()
  // 修改月日格式
  m < 10 && (m = '0' + m)
  d < 10 && (d = '0' + d)
  // 拼接字符串
  return `${y}-${m}-${d}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
