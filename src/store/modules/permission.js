// vuex中的permission模块用来存放当前的 静态路由 + 当前用户的 权限路由

// 静态路由权限
import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  routes: []// 所有人默认拥有静态路由
}
const mutations = {
  // newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部分
  setRouters(state, newRoutes) {
  //   // 应该是每次更新 都应该在静态路由的基础上进行追加
    state.routes = [...constantRoutes, ...newRoutes]
    // console.log(state.routes)
  }

}
const actions = {
// 第二个参数为当前用户的所拥有的菜单权限
  filterRoutes(context, menus) {
    // console.log('过滤的路由')
    // 全部的路由
    // console.log(asyncRoutes)
    // 过滤出只有权限的路由
    // console.log(menus)
    const routes = asyncRoutes.filter(item => menus.includes(item.name))
    // console.log('过滤的结果')
    // console.log(routes)
    context.commit('setRouters', routes)
    // 将路由导出
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

