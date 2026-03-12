<template>
  <div class="production-report">
    <SearchFilter v-show="!isFullscreen" :loading="loading" @search="handleSearch" @reset="handleReset" />
    
    <div class="table-container">
      <div class="table-header">
        <div class="table-actions">
          <el-button circle size="small" @click="handleRefresh" title="刷新">
            <el-icon><Refresh /></el-icon>
          </el-button>
          <el-button circle size="small" @click="handleExport" title="导出">
            <el-icon><Download /></el-icon>
          </el-button>
          <el-button circle size="small" ref="columnSettingsBtnRef" @click="handleColumnSettings" title="列设置">
            <el-icon><Setting /></el-icon>
          </el-button>
          <el-button 
            circle 
            size="small" 
            :type="isFullscreen ? 'primary' : 'default'" 
            @click="handleFullscreen" 
            :title="isFullscreen ? '退出全屏' : '全屏'"
          >
            <el-icon><FullScreen /></el-icon>
          </el-button>
        </div>
      </div>
      
      <DataTable
        :table-data="tableData"
        :loading="loading"
        :column-config="columnConfig"
        @filter-change="handleFilterChange"
      />
      
      <Pagination
        :total="totalElements"
        :current-page="currentPage"
        :page-size="pageSize"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
    
    <ExportDialog
      v-model:visible="exportDialogVisible"
      :table-data="tableData"
      :column-config="columnConfig"
      @export="handleExportData"
    />
    
    <ColumnSettings
      v-model:visible="columnSettingsVisible"
      :column-config="columnConfig"
      :trigger-ref="triggerRef"
      @confirm="handleColumnConfirm"
      @reset="handleColumnReset"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Refresh, Download, Setting, FullScreen } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import SearchFilter from '@/components/SearchFilter/index.vue'
import DataTable from '@/components/DataTable/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import ExportDialog from '@/components/ExportDialog/index.vue'
import ColumnSettings from '@/components/ColumnSettings/index.vue'
import { getReportList, getColumnConfig, saveColumnConfig } from '@/common/apis/report/index'
import type { ReportItem, ColumnConfig, ReportListParams } from '@/common/apis/report/type'

const tableData = ref<ReportItem[]>([])
const totalElements = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const loading = ref(false)
const isFullscreen = ref(false)
const exportDialogVisible = ref(false)
const columnSettingsVisible = ref(false)
const columnSettingsBtnRef = ref<InstanceType<typeof import('element-plus')['ElButton']> | null>(null)
const searchParams = ref<Partial<ReportListParams>>({})

const triggerRef = computed(() => columnSettingsBtnRef.value?.$el ?? null)

const defaultColumnConfig: ColumnConfig[] = [
  { prop: 'reportDate', label: '报工日期', visible: true },
  { prop: 'productOrderNumber', label: '生产订单编号', visible: true },
  { prop: 'workOrderNumber', label: '生产工单编号', visible: true },
  { prop: 'planQuantity', label: '计划生产数量', visible: true },
  { prop: 'workCenterName', label: '生产车间', visible: true },
  { prop: 'materialCode', label: '物料编号', visible: true },
  { prop: 'materialName', label: '物料名称', visible: true },
  { prop: 'finishCount', label: '报工数量', visible: true },
  { prop: 'procedureName', label: '工序', visible: true },
  { prop: 'userNickname', label: '作业员', visible: true },
  { prop: 'qualified', label: '合格数量', visible: true },
  { prop: 'unqualified', label: '不合格数量', visible: true },
  { prop: 'qualifiedPercentage', label: '合格率', visible: true }
]

const columnConfig = ref<ColumnConfig[]>([...defaultColumnConfig])

const fetchData = async () => {
  loading.value = true
  try {
    const allParams: ReportListParams = {
      page: currentPage.value,
      size: pageSize.value,
      ...searchParams.value
    }
    const params = Object.fromEntries(
      Object.entries(allParams).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    ) as ReportListParams
    const res = await getReportList(params)
    const responseData = res.data
    if (responseData?.code === 200 || responseData?.code === '200') {
      tableData.value = responseData.data.content
      totalElements.value = responseData.data.totalElements
    }
  } catch (error: any) {
    ElMessage.error('获取数据失败：' + error.message)
  } finally {
    loading.value = false
  }
}

const fetchColumnConfig = async () => {
  try {
    const res = await getColumnConfig()
    const responseData = res.data
    if ((responseData?.code === 200 || responseData?.code === '200') && responseData.data) {
      const columnInfo = JSON.parse(responseData.data.columnInformation)
      if (columnInfo.sortData) {
        const sortedColumns = Object.keys(columnInfo.sortData)
          .sort((a: string, b: string) => columnInfo.sortData[a] - columnInfo.sortData[b])
          .map((key: string) => {
            const prop = key.replace('type=', '')
            const column = defaultColumnConfig.find(c => c.prop === prop)
            const baseColumn: ColumnConfig = column || { prop, label: prop, visible: true }
            return {
              ...baseColumn,
              visible: columnInfo.visibleData ? columnInfo.visibleData[key] !== 0 : true,
              fixed: columnInfo.fixedData ? columnInfo.fixedData[key] || null : null
            }
          })
        columnConfig.value = sortedColumns
      }
    }
  } catch (error) {
    console.error('获取列配置失败：', error)
  }
}

const handleSearch = (params: Partial<ReportListParams>) => {
  searchParams.value = params
  currentPage.value = 1
  fetchData()
}

const handleReset = () => {
  searchParams.value = {}
  currentPage.value = 1
  fetchData()
}

const handleRefresh = () => {
  fetchData()
}

const handleExport = () => {
  exportDialogVisible.value = true
}

const handleColumnSettings = () => {
  columnSettingsVisible.value = true
}

const handleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchData()
}

const handleFilterChange = (filters: Record<string, string[]>) => {
  console.log('Filter changed:', filters)
}

interface ExportData {
  fileName: string
  fileType: string
  title: string
  data: ReportItem[]
  fields: string[]
  includeHeader: boolean
  includeData: boolean
}

const handleExportData = async (exportData: ExportData) => {
  try {
    let content = ''
    const headers = exportData.fields.map(field => {
      const column = columnConfig.value.find(c => c.prop === field)
      return column ? column.label : field
    })
    
    if (exportData.fileType === 'csv') {
      content = headers.join(',') + '\n'
      exportData.data.forEach(row => {
        const rowData = exportData.fields.map(field => String(row[field as keyof ReportItem] || ''))
        content += rowData.join(',') + '\n'
      })
    } else if (exportData.fileType === 'xml') {
      content = '<?xml version="1.0" encoding="UTF-8"?>\n<report>\n'
      if (exportData.title) {
        content += `  <title>${exportData.title}</title>\n`
      }
      content += '  <data>\n'
      exportData.data.forEach(row => {
        content += '    <row>\n'
        exportData.fields.forEach(field => {
          content += `      <${field}>${row[field as keyof ReportItem] || ''}</${field}>\n`
        })
        content += '    </row>\n'
      })
      content += '  </data>\n</report>'
    } else if (exportData.fileType === 'html') {
      content = '<!DOCTYPE html>\n<html>\n<head>\n'
      if (exportData.title) {
        content += `<title>${exportData.title}</title>\n`
      }
      content += '</head>\n<body>\n<table border="1">\n<thead>\n<tr>\n'
      headers.forEach(header => {
        content += `<th>${header}</th>\n`
      })
      content += '</tr>\n</thead>\n<tbody>\n'
      exportData.data.forEach(row => {
        content += '<tr>\n'
        exportData.fields.forEach(field => {
          content += `<td>${row[field as keyof ReportItem] || ''}</td>\n`
        })
        content += '</tr>\n'
      })
      content += '</tbody>\n</table>\n</body>\n</html>'
    } else if (exportData.fileType === 'txt') {
      content = headers.join('\t') + '\n'
      exportData.data.forEach(row => {
        const rowData = exportData.fields.map(field => String(row[field as keyof ReportItem] || ''))
        content += rowData.join('\t') + '\n'
      })
    }
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${exportData.fileName}.${exportData.fileType}`
    link.click()
    URL.revokeObjectURL(url)
    
    ElMessage.success('导出成功')
  } catch (error: any) {
    ElMessage.error('导出失败：' + error.message)
  }
}

const handleColumnConfirm = async (columns: ColumnConfig[]) => {
  columnConfig.value = columns
  try {
    const sortData: Record<string, number> = {}
    const visibleData: Record<string, number> = {}
    const fixedData: Record<string, string> = {}
    columns.forEach((col, index) => {
      sortData[`type=${col.prop}`] = index + 1
      visibleData[`type=${col.prop}`] = col.visible ? 1 : 0
      if (col.fixed) {
        fixedData[`type=${col.prop}`] = col.fixed
      }
    })
    await saveColumnConfig({
      modularType: 'CommonProductionDailyReport',
      columnInformation: JSON.stringify({ sortData, visibleData, fixedData })
    })
    ElMessage.success('列设置保存成功')
    await fetchColumnConfig()
  } catch (error: any) {
    ElMessage.error('保存列设置失败：' + error.message)
  }
}

const handleColumnReset = () => {
  columnConfig.value = defaultColumnConfig.map(col => ({ ...col }))
  columnSettingsVisible.value = false
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  fetchData()
  fetchColumnConfig()
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style lang="scss" scoped>
.production-report {
  background: #f5f5f5;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
  min-height: 0;
}

.table-header {
  display: flex;
  justify-content: flex-end;
  padding: 6px 15px;
  border-bottom: 1px solid #ebeef5;
}

.table-actions {
  display: flex;
  gap: 4px;
}
</style>
