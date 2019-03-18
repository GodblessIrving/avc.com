// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from './scripts/http'
import store from './scripts/store'
import router from './scripts/router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import vueScrollBehavior from 'vue-scroll-behavior'
import echarts from 'echarts'
import $ from 'jquery'
import App from './App'

import './assets/bootstrap/js/bootstrap.min.js'
import './assets/bootstrap/css/bootstrap.min.css'
import 'normalize.css'
import './scripts/Validation.js'
import './scripts/common.js'
import './scripts/spark-md5.min.js'
import './scripts/jquery-ui/jquery-ui.min.js'
import './scripts/base64.min.js'

Vue.use(ElementUI)
Vue.use(vueScrollBehavior, { router: router })
Vue.prototype.$echarts = echarts
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  axios,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
