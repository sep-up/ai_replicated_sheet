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
      @export="handleExportData"
    />
    
    <ColumnSettings
      v-model:visible="columnSettingsVisible"
      :column-config="columnConfig"
      :trigger-ref="columnSettingsBtnRef"
      @confirm="handleColumnConfirm"
      @reset="handleColumnReset"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Refresh, Download, Setting, FullScreen } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import SearchFilter from '../components/SearchFilter.vue'
import DataTable from '../components/DataTable.vue'
import Pagination from '../components/Pagination.vue'
import ExportDialog from '../components/ExportDialog.vue'
import ColumnSettings from '../components/ColumnSettings.vue'
import { getReportList, getColumnConfig, saveColumnConfig } from '../api/report'

const tableData = ref([])
const totalElements = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const loading = ref(false)
const isFullscreen = ref(false)
const exportDialogVisible = ref(false)
const columnSettingsVisible = ref(false)
const columnSettingsBtnRef = ref(null)
const searchParams = ref({})
const defaultColumnConfig = [
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

const columnConfig = ref([...defaultColumnConfig])

const fetchData = async () => {
  loading.value = true
  try {
    const allParams = {
      page: currentPage.value,
      size: pageSize.value,
      ...searchParams.value
    }
    const params = Object.fromEntries(
      Object.entries(allParams).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    )
    const res = await getReportList(params)
    if (res.code === 200) {
      tableData.value = res.data.content
      totalElements.value = res.data.totalElements
    }
  } catch (error) {
    ElMessage.error('获取数据失败：' + error.message)
  } finally {
    loading.value = false
  }
}

const fetchColumnConfig = async () => {
  try {
    const res = await getColumnConfig()
    if (res.code === 200 && res.data) {
      const columnInfo = JSON.parse(res.data.columnInformation)
      if (columnInfo.sortData) {
        const sortedColumns = Object.keys(columnInfo.sortData)
          .sort((a, b) => columnInfo.sortData[a] - columnInfo.sortData[b])
          .map(key => {
            const prop = key.replace('type=', '')
            const column = defaultColumnConfig.find(c => c.prop === prop)
            const baseColumn = column || { prop, label: prop, visible: true }
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

const handleSearch = (params) => {
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

const handlePageChange = (page) => {
  currentPage.value = page
  fetchData()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchData()
}

const handleFilterChange = (filters) => {
  console.log('Filter changed:', filters)
}

const handleExportData = async (exportData) => {
  try {
    let content = ''
    const headers = exportData.fields.map(field => {
      const column = columnConfig.value.find(c => c.prop === field)
      return column ? column.label : field
    })
    
    if (exportData.fileType === 'csv') {
      content = headers.join(',') + '\n'
      exportData.data.forEach(row => {
        const rowData = exportData.fields.map(field => row[field] || '')
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
          content += `      <${field}>${row[field] || ''}</${field}>\n`
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
          content += `<td>${row[field] || ''}</td>\n`
        })
        content += '</tr>\n'
      })
      content += '</tbody>\n</table>\n</body>\n</html>'
    } else if (exportData.fileType === 'txt') {
      content = headers.join('\t') + '\n'
      exportData.data.forEach(row => {
        const rowData = exportData.fields.map(field => row[field] || '')
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
  } catch (error) {
    ElMessage.error('导出失败：' + error.message)
  }
}

const handleColumnConfirm = async (columns) => {
  columnConfig.value = columns
  try {
    const sortData = {}
    const visibleData = {}
    const fixedData = {}
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
  } catch (error) {
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

<style scoped>
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
