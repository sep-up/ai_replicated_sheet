import request from '../utils/request'

export function getReportList(params) {
  return request({
    url: '/jy-app/api/product/work/reports',
    method: 'get',
    params
  })
}

export function getColumnConfig(modularType = 'CommonProductionDailyReport') {
  return request({
    url: '/jy-app/formColumns/user/column',
    method: 'get',
    params: { modularType }
  })
}

export function saveColumnConfig(data) {
  return request({
    url: '/jy-app/formColumns/user/column',
    method: 'post',
    data
  })
}
