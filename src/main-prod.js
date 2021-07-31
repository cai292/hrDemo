import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 引入自定义指令   一次性全部导入模块变量！
import * as directives from '@/directives'
// directives是一个对象
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// 设置element为当前的语言
import i18n from '@/lang/index'
Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })

Vue.config.productionTip = false

// 注册全局插件
import Components from '@/components'
Vue.use(Components) // 注册自己的插件

// 引入过滤器  所有的方法结构
import * as filters from '@/filters'

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 引入打印包
import Print from 'vue-print-nb'
Vue.use(Print)

// 演示全局的混入  只要对象里面有vue相同的方法  就可以用
import { checkPermission } from '@/mixin'
Vue.mixin(checkPermission)

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})
