// 专门处理路由权限
// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
import { getToken } from './utils/auth'
const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面

// 路由前置守卫
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()
  //   判断有没有token
  if (getToken()) {
    //   如果有token 继续判断是不是去登录页
    if (to.path === '/login') {
      next('/') // 跳到主页
    } else {
      if (!store.getters.userId) {
        // roles用户权限数据
        await store.dispatch('user/getUserInfo')// 用户资料
        // console.log(roles)
        // console.log(store.getters.menus)
        // const routes = await store.dispatch('permission/filterRoutes', store.getters.menus)
        // 跳转页面之前，调用action筛选路由
        const res = await store.dispatch('permission/filterRoutes', store.getters.menus)
        // console.log(routes)
        // 上面是筛选菜单路由
        // 如果没有addroutes就打开的都是404
        // 交给路由配置
        // 解决404问题
        router.addRoutes([...res, { path: '*', redirect: '/404', hidden: true }])
        // router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])// 添加动态路由到路由表  铺路
        next(to.path) // 每次刷新没数据，都会追加原地跳一圈，重新触发
      }
      // 第二次来到，有数据的前提下，直接放行
      next() // 直接放行
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 如果找到了 表示在在名单里面
      next()
    } else {
      next('/login') // 跳到登录页
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})

// 后置守卫
router.afterEach(route => {
  NProgress.done() // 关闭进度条
})
