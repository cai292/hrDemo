import request from '@/utils/request'
// 登录页面
export function login(data) {
  return request({ url: '/sys/login', method: 'post', data })
}
// 用户资料接口、
export function getUserInfo() {
  return request({
    method: 'post',
    url: '/sys/profile'
  })
}
// 获取用户的基本信息  现在写它 完全是为了显示头像
export function getUserDetailById(id) {
  return request({
    method: 'get',
    url: `/sys/user/${id}`
  })
}

export function logout() {}
