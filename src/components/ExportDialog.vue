<template>
  <el-dialog
    v-model="dialogVisible"
    title="导出数据"
    width="600px"
    @close="handleClose"
  >
    <el-form :model="exportForm" label-width="100px">
      <el-form-item label="文件名">
        <el-input v-model="exportForm.fileName" placeholder="请输入文件名" />
      </el-form-item>
      <el-form-item label="保存类型">
        <el-select v-model="exportForm.fileType" placeholder="请选择保存类型" style="width: 100%">
          <el-option label="CSV (逗号分隔)(*.csv)" value="csv" />
          <el-option label="网页(*.html)" value="html" />
          <el-option label="XML 数据(*.xml)" value="xml" />
          <el-option label="文本文件(制表符分隔)(*.txt)" value="txt" />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" v-if="showTitle">
        <el-input v-model="exportForm.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="选择数据">
        <el-select v-model="exportForm.dataRange" placeholder="请选择数据范围" style="width: 100%">
          <el-option label="当前页数据" value="current" />
          <el-option label="当前筛选的数据" value="filtered" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择字段">
        <el-checkbox-group v-model="exportForm.selectedFields">
          <el-checkbox label="reportDate">报工日期</el-checkbox>
          <el-checkbox label="productOrderNumber">生产订单编号</el-checkbox>
          <el-checkbox label="workOrderNumber">生产工单编号</el-checkbox>
          <el-checkbox label="planQuantity">计划生产数量</el-checkbox>
          <el-checkbox label="workCenterName">生产车间</el-checkbox>
          <el-checkbox label="materialCode">物料编号</el-checkbox>
          <el-checkbox label="materialName">物料名称</el-checkbox>
          <el-checkbox label="finishCount">报工数量</el-checkbox>
          <el-checkbox label="procedureName">工序</el-checkbox>
          <el-checkbox label="userNickname">作业员</el-checkbox>
          <el-checkbox label="qualified">合格数量</el-checkbox>
          <el-checkbox label="unqualified">不合格数量</el-checkbox>
          <el-checkbox label="qualifiedPercentage">合格率</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="参数设置">
        <div class="param-settings">
          <div class="param-group">
            <div class="param-title">基本选项</div>
            <el-checkbox v-model="exportForm.includeHeader">表头</el-checkbox>
            <el-checkbox v-model="exportForm.includeData">源数据</el-checkbox>
            <el-checkbox v-model="exportForm.includeFooter" disabled>表尾</el-checkbox>
          </div>
          <div class="param-group">
            <div class="param-title">高级选项</div>
            <el-checkbox v-model="exportForm.groupHeader" disabled>分组表头</el-checkbox>
            <el-checkbox v-model="exportForm.merge" disabled>合并</el-checkbox>
            <el-checkbox v-model="exportForm.style" disabled>样式</el-checkbox>
            <el-checkbox v-model="exportForm.expandTree" disabled>展开树</el-checkbox>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleExport">导出</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  tableData: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'export'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const showTitle = computed(() => {
  return exportForm.value.fileType === 'xml' || exportForm.value.fileType === 'html'
})

const exportForm = ref({
  fileName: `生产报工报表${new Date().getTime()}`,
  fileType: 'csv',
  title: '',
  dataRange: 'current',
  selectedFields: [
    'reportDate',
    'productOrderNumber',
    'workOrderNumber',
    'planQuantity',
    'workCenterName',
    'materialCode',
    'materialName',
    'finishCount',
    'procedureName',
    'userNickname',
    'qualified',
    'unqualified',
    'qualifiedPercentage'
  ],
  includeHeader: true,
  includeData: true,
  includeFooter: false,
  groupHeader: false,
  merge: false,
  style: false,
  expandTree: false
})

const handleClose = () => {
  emit('update:visible', false)
}

const handleExport = () => {
  const data = exportForm.value.dataRange === 'current' ? props.tableData : props.tableData
  const exportData = {
    fileName: exportForm.value.fileName,
    fileType: exportForm.value.fileType,
    title: exportForm.value.title,
    data: data,
    fields: exportForm.value.selectedFields,
    includeHeader: exportForm.value.includeHeader,
    includeData: exportForm.value.includeData
  }
  emit('export', exportData)
  handleClose()
}
</script>

<style scoped>
.param-settings {
  display: flex;
  gap: 20px;
}

.param-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.param-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
