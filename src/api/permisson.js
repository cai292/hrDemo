import request from '@/utils/request'

// 获取所有权限点
export const getPermissionList = (params) =>
  request({
    method: 'get',
    url: '/sys/permission',
    params
  })
// 根据ID更新权限点详情
export const updatePermission = (data) =>
  request({
    method: 'put',
    url: `/sys/permission/${data.id}`,
    data
  })
  // 根据ID获取权限点详情
export const getPermissionDetail = (id) =>
  request({
    method: 'get',
    url: `/sys/permission/${id}`
  })
// 根据id删除权限点
export const delPermission = (id) =>
  request({
    method: 'DELETE',
    url: `/sys/permission/${id}`
  })
  // 添加权限点
export const addPermission = (data) =>
  request({
    method: 'POST',
    url: `/sys/permission`,
    data
  })
