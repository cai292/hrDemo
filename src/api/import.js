import request from '@/utils/request'

// 导入员工接口
export const importEmployee = (data) =>
  request({
    method: 'post',
    url: '/sys/user/batch',
    data
  })
