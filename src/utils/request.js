import axios from 'axios'
import { Message } from 'element-ui'

import { getTimeStamp } from '@/utils/auth'
import store from '@/store'
import router from '@/router'

// 创建一个axios的实例
const service = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000 // 设置超时时间
})
// 请求拦截器
service.interceptors.request.use(
  config => {
    // console.log(store.getters.token)
    // 在这个位置需要统一的去注入token
    // console.log(getToken())
    // if (getToken()) {
    if (store.getters.token) {
      // console.log(store.getters.token)

      if (IsCheckTimeOut()) {
        console.log(1)
        // 如果它为true表示 过期了
        // token没用了 因为超时了
        store.dispatch('user/logout') // 登出操作
        router.push('/login')
        return Promise.reject(new Error('token超时了'))
      }
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
// 响应拦截器
service.interceptors.response.use(
  response => {
    // console.log(response)
    const { success, data, message } = response.data
    //   要根据success的成功与否决定下面的操作
    if (success) {
      return data
    } else {
      // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  },
  err => {
    console.log(err)
    // err信息里面有response的对象
    if (err.response && err.response.data && err.response.data.code === 10002) {
      // 当等于10002的时候 表示 后端告诉我token超时了
      store.dispatch('user/logout') // 登出action 删除token
      router.push('/login')
    }
    Message.error(err.message) // 提示错误信息
    return Promise.reject(err) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
  }
)

// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  var TimeOut = 3600 // 定义超时时间
  var currentTime = Date.now() // 当前时间戳
  // console.log(currentTime)
  var timeStamp = getTimeStamp() // 缓存时间戳
  // console.log(timeStamp)
  // console.log((currentTime - timeStamp) / 1000)
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
