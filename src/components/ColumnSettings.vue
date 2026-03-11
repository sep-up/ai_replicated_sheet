<template>
  <el-popover
    :visible="visible"
    :virtual-ref="triggerRef"
    virtual-triggering
    placement="bottom-end"
    :width="360"
    @update:visible="$emit('update:visible', $event)"
  >
    <div class="column-settings">
      <div class="select-all">
        <el-checkbox v-model="selectAll" @change="handleSelectAll">全部</el-checkbox>
      </div>
      <div class="column-list" ref="columnListRef">
        <div
          v-for="(column, index) in columns"
          :key="column.prop"
          class="column-item"
          draggable="true"
          @dragstart="handleDragStart(index, $event)"
          @dragover="handleDragOver($event)"
          @drop="handleDrop(index, $event)"
        >
          <div class="column-left">
            <el-icon class="drag-icon"><Rank /></el-icon>
            <el-checkbox v-model="column.visible">{{ column.label }}</el-checkbox>
          </div>
          <div class="column-actions">
            <el-tooltip content="固定左侧" placement="top">
              <el-button
                type="text"
                size="small"
                :class="{ 'active-btn': column.fixed === 'left' }"
                @click="handleFixLeft(index)"
              >
                <el-icon :size="16"><DArrowLeft /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="固定右侧" placement="top">
              <el-button
                type="text"
                size="small"
                :class="{ 'active-btn': column.fixed === 'right' }"
                @click="handleFixRight(index)"
              >
                <el-icon :size="16"><DArrowRight /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="settings-footer">
        <el-button size="small" @click="handleReset">恢复默认</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确认</el-button>
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { DArrowLeft, DArrowRight, Rank } from '@element-plus/icons-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  columnConfig: {
    type: Array,
    default: () => []
  },
  triggerRef: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'confirm', 'reset'])

const columnListRef = ref(null)
const draggedIndex = ref(null)

const columns = ref([])

const selectAll = computed({
  get: () => columns.value.every(col => col.visible),
  set: () => {}
})

watch(() => props.columnConfig, (newVal) => {
  columns.value = newVal.map(col => ({
    ...col,
    visible: col.visible !== false
  }))
}, { immediate: true, deep: true })

const handleSelectAll = (val) => {
  columns.value.forEach(col => {
    col.visible = val
  })
}

const handleDragStart = (index, event) => {
  draggedIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
}

const handleDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

const handleDrop = (index, event) => {
  event.preventDefault()
  if (draggedIndex.value !== null && draggedIndex.value !== index) {
    const draggedColumn = columns.value[draggedIndex.value]
    columns.value.splice(draggedIndex.value, 1)
    columns.value.splice(index, 0, draggedColumn)
    draggedIndex.value = null
  }
}

const handleFixLeft = (index) => {
  if (columns.value[index].fixed === 'left') {
    columns.value[index].fixed = null
  } else {
    columns.value[index].fixed = 'left'
  }
}

const handleFixRight = (index) => {
  if (columns.value[index].fixed === 'right') {
    columns.value[index].fixed = null
  } else {
    columns.value[index].fixed = 'right'
  }
}

const handleReset = () => {
  emit('reset')
}

const handleClose = () => {
  emit('update:visible', false)
}

const handleConfirm = () => {
  emit('confirm', columns.value)
  handleClose()
}
</script>

<style scoped>
.column-settings {
  max-height: 400px;
  display: flex;
  flex-direction: column;
}

.select-all {
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  margin-bottom: 8px;
}

.column-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
  max-height: 280px;
}

.column-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
  cursor: move;
}

.column-item:hover {
  background-color: #f5f7fa;
}

.column-item:last-child {
  border-bottom: none;
}

.column-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drag-icon {
  color: #c0c4cc;
  cursor: move;
}

.column-actions {
  display: flex;
  gap: 4px;
}

.column-actions .el-button {
  padding: 4px;
  color: #c0c4cc;
}

.column-actions .el-button:hover {
  color: #409eff;
}

.column-actions .el-button.active-btn {
  color: #409eff !important;
}

.column-actions .el-button.is-disabled {
  color: #c0c4cc;
}

.settings-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid #eee;
  margin-top: 8px;
}
</style>
