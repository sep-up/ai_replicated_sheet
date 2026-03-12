import { request } from '@/http/axios'
import type { AxiosResponse } from 'axios'
import type { ReportListParams, ApiResponse, ReportListData, ColumnConfigData, SaveColumnConfigParams } from './type'

export function getReportList(params: ReportListParams): Promise<AxiosResponse<ApiResponse<ReportListData>>> {
  return request({
    url: '/jy-app/api/product/work/reports',
    method: 'get',
    params
  })
}

export function getColumnConfig(modularType = 'CommonProductionDailyReport'): Promise<AxiosResponse<ApiResponse<ColumnConfigData>>> {
  return request({
    url: '/jy-app/formColumns/user/column',
    method: 'get',
    params: { modularType }
  })
}

export function saveColumnConfig(data: SaveColumnConfigParams): Promise<AxiosResponse<ApiResponse>> {
  return request({
    url: '/jy-app/formColumns/user/column',
    method: 'post',
    data
  })
}
