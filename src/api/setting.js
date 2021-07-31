// 角色管理
import request from '@/utils/request'

// 角色列表数据
export const getRoleList = (params) =>
  request({
    method: 'get',
    url: '/sys/role',
    params
  })

// 获取公司信息
export const getCompanyInfo = (companyId) =>
  request({
    method: 'get',
    url: `/company/${companyId}`
  })
//   删除角色
export const deleteRole = (id) =>
  request({
    method: 'DELETE',
    url: `/sys/role/${id}`
  })
// 角色详情
export const getRoleDetail = (id) =>
  request({
    method: 'GET',
    url: `/sys/role/${id}`
  })
//   修改角色
export const updateRole = (data) =>
  request({
    method: 'PUT',
    url: `/sys/role/${data.id}`,
    data
  })
// 添加角色
export const addRole = (data) =>
  request({
    method: 'POST',
    url: `/sys/role`,
    data
  })

// 给角色分配权限
export const assignPerm = (data) =>
  request({
    method: 'put',
    url: `/sys/role/assignPrem`,
    data
  })

