import request from '@/utils/request'

/**
 *  获取员工的简单列表
 * **/

export const getEmployeeSimple = () =>
  request({
    method: 'get',
    url: '/sys/user/simple'
  })

// 员工列表数据
export const getEmployeeList = (params) =>
  request({
    method: 'get',
    url: '/sys/user',
    params
  })

// 删除员工数据
export const delEmployee = (id) =>
  request({
    method: 'delete',
    url: `/sys/user/${id}`
  })

// 新增员工数据
export const addEmployee = (data) =>
  request({
    method: 'post',
    url: `/sys/user`,
    data
  })
  // 保存员工个人信息
export const saveUserDetailById = (data) =>
  request({
    method: 'put',
    url: `/sys/user/${data.id}`,
    data
  })

// 读取用户详情的基础信息
export const getPersonalDetail = (id) =>
  request({
    method: 'get',
    url: `/employees/${id}/personalInfo`
  })

// 更新用户详情的基础信息
export const updatePersonal = (data) =>
  request({
    method: 'put',
    url: `/employees/${data.userId}/personalInfo`,
    data
  })

// 获取用户的岗位信息
export const getJobDetail = (id) =>
  request({
    method: 'get',
    url: `/employees/${id}/jobs`

  })
  // 保存岗位信息
export const updateJob = (data) =>
  request({
    method: 'put',
    url: `/employees/${data.userId}/jobs`,
    data
  })

// 给员工分配角色
export const assignRoles = (data) =>
  request({
    method: 'put',
    url: `/sys/user/assignRoles`,
    data
  })
