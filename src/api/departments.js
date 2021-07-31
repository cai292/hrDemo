// 组织架构数据
import request from '@/utils/request'
// 获取架构数据
export const getDepartments = () =>
  request({
    method: 'get',
    url: '/company/department'
  })

/** *
 *  删除部门
 * **/

export const delDepartments = id =>
  request({
    method: 'delete',
    url: `/company/department/${id}`
  })

// 新增部门
export const addDepartments = data =>
  request({
    method: 'post',
    url: `/company/department`,
    data
  })
// 根据ID查询部门详情
export const getDepartDetail = id =>
  request({
    method: 'GET',
    url: `/company/department/${id}`
  })
// 编辑部门
export const updateDepartments = data =>
  request({
    method: 'PUT',
    url: `/company/department/${data.id}`,
    data
  })
