export interface ReportListParams {
  page: number
  size: number
  productOrderNumber?: string
  workOrderNumber?: string
  workCenterName?: string
  materialCode?: string
  materialName?: string
  userNickname?: string
  startDate?: string
  endDate?: string
}

export interface ReportItem {
  reportDate: string
  productOrderNumber: string
  workOrderNumber: string
  planQuantity: number
  workCenterName: string
  materialCode: string
  materialName: string
  finishCount: number
  procedureName: string
  userNickname: string
  qualified: number
  unqualified: number
  qualifiedPercentage: number
}

export interface ApiResponse<T = any> {
  code: string | number
  data: T
  message?: string
}

export interface ReportListData {
  content: ReportItem[]
  totalElements: number
}

export interface ColumnConfigData {
  columnInformation: string
}

export interface SaveColumnConfigParams {
  modularType: string
  columnInformation: string
}

export interface ColumnConfig {
  prop: string
  label: string
  visible: boolean
  fixed?: 'left' | 'right' | null
  minWidth?: number
  align?: string
  sortable?: boolean
}
