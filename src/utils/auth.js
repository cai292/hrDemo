// 保存到Cookies
// token

import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token' // 设置一个独一无二的key
// 拿到token
export function getToken() {
  return Cookies.get(TokenKey)
}
// 设置token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
// 删除token
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 时间戳token
const timeKey = 'hrsaas-timestamp-key' // 设置一个独一无二的key

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}

// 设置时间戳  Date.now()
export function setTimeStamp() {
  return Cookies.set(timeKey, Date.now())
}
