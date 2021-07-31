import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { getToken, removeToken, setToken, setTimeStamp } from '@/utils/auth'
import { resetRouter } from '@/router'
// 状态、
const state = {
  token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
  userInfo: {}
}
// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token // 设置token
    // console.log(state.token)
    // vuex变化 => 缓存数据
    setToken(token) // vuex和缓存同步
  },
  removeToken(state) {
    state.token = null
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  // 用户数据资料
  setUserInfo(state, data) {
    // console.log(data)
    state.userInfo = { ...data } // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
    console.log(state.userInfo)
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 异步
const actions = {
  // 登录
  async login(context, data) {
    // 响应拦截器已经处理  所以拿到的直接是token
    const res = await login(data)
    console.log(res)

    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    context.commit('setToken', res)
    setTimeStamp()
  },
  // 用户基本资料
  async getUserInfo(context) {
    const res = await getUserInfo() // res就是用户的基本资料
    // console.log(res)
    const baseInfo = await getUserDetailById(res.userId) // 拿到头像
    // 将两个接口结果合并
    const baseResult = { ...res, ...baseInfo }
    // console.log(baseResult)
    context.commit('setUserInfo', baseResult) // 将整个的个人信息设置到用户的vuex数据中
    return baseResult
  },
  // 退出删除token
  logout(context) {
    context.commit('removeToken')

    // 删除token
    context.commit('removeToken') // 不仅仅删除了vuex中的 还删除了缓存中的
    context.commit('removeUserInfo') // 删除用户信息
    // 重置路由
    // 访问不了  访问历史的路由
    resetRouter()
    // { root: true } 就表示当前的context不是子模块了 而是父模块
    // context.commit('permission/setRouters', [], { root: true })
    // 退出清除菜单的路由  兄弟之间就要用到{ root: true }
    context.commit('permission/setRouters', [], { root: true })
  }
}

// 这个需要我们自己开发
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
