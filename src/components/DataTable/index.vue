<template>
  <div class="data-table">
    <el-table
      :data="tableData"
      :loading="loading"
      border
      style="width: 100%"
      height="100%"
      @filter-change="handleFilterChange"
    >
      <el-table-column
        type="index"
        label="序号"
        width="60"
        align="center"
        fixed="left"
      />
      <template v-for="column in visibleColumns" :key="column.prop">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :min-width="column.minWidth || 100"
          :align="column.align || 'left'"
          :fixed="column.fixed"
          :sortable="column.sortable"
          :filters="getFilters(column.prop)"
          :filter-method="getFilterMethod(column.prop)"
          show-overflow-tooltip
        >
          <template v-if="column.prop === 'qualifiedPercentage'" #default="{ row }">
            {{ row.qualifiedPercentage }}%
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { ReportItem, ColumnConfig } from '@/common/apis/report/type'

interface Props {
  tableData: ReportItem[]
  loading: boolean
  columnConfig: ColumnConfig[]
}

const props = withDefaults(defineProps<Props>(), {
  tableData: () => [],
  loading: false,
  columnConfig: () => []
})

const emit = defineEmits<{
  (e: 'filter-change', filters: Record<string, string[]>): void
}>()

const columnWidthMap: Record<string, number> = {
  reportDate: 120,
  productOrderNumber: 150,
  workOrderNumber: 150,
  planQuantity: 100,
  workCenterName: 100,
  materialCode: 150,
  materialName: 150,
  finishCount: 80,
  procedureName: 100,
  userNickname: 80,
  qualified: 80,
  unqualified: 100,
  qualifiedPercentage: 80
}

const columnAlignMap: Record<string, string> = {
  planQuantity: 'right',
  finishCount: 'right',
  qualified: 'right',
  unqualified: 'right',
  qualifiedPercentage: 'right'
}

const sortableColumns = ['reportDate']
const filterableColumns = ['reportDate', 'productOrderNumber', 'workOrderNumber', 'workCenterName', 'materialCode', 'materialName', 'procedureName', 'userNickname']

const visibleColumns = computed(() => {
  return props.columnConfig
    .filter(col => col.visible !== false)
    .map(col => ({
      ...col,
      minWidth: columnWidthMap[col.prop] || 100,
      align: columnAlignMap[col.prop] || 'left',
      sortable: sortableColumns.includes(col.prop),
      fixed: col.fixed || undefined
    }))
})

const getFilters = (prop: string) => {
  if (!filterableColumns.includes(prop)) return undefined
  const values = [...new Set(props.tableData.map(item => item[prop as keyof ReportItem]).filter(v => v))]
  return values.map(v => ({ text: String(v), value: String(v) }))
}

const getFilterMethod = (prop: string) => {
  if (!filterableColumns.includes(prop)) return undefined
  return (value: string, row: ReportItem) => row[prop as keyof ReportItem] === value
}

const handleFilterChange = (filters: Record<string, string[]>) => {
  emit('filter-change', filters)
}
</script>

<style lang="scss" scoped>
.data-table {
  flex: 1;
  background: #fff;
  overflow: hidden;

  :deep(.el-table__header-wrapper .el-table__header th) {
    background-color: #f5f5f5;
  }

  :deep(.el-table) {
    color: #4b4949ff;
  }

  :deep(.el-table .el-table__cell) {
    padding: 6px 0;
  }

  :deep(.el-table .cell) {
    white-space: nowrap;
  }

  :deep(.el-table__body-wrapper .el-table__cell) {
    border-right: none;
  }

  :deep(.el-table__body-wrapper .el-table__row td:last-child) {
    border-right: none;
  }
}
</style>
