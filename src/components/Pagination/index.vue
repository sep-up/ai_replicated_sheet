<template>
  <div class="pagination">
    <div class="pagination-info">
      共 {{ total }} 条记录
    </div>
    <div class="pagination-controls">
      <el-select :model-value="pageSize" placeholder="每页显示" style="width: 100px; margin-right: 10px" @change="handleSizeChange">
        <el-option label="10条/页" :value="10" />
        <el-option label="20条/页" :value="20" />
        <el-option label="50条/页" :value="50" />
        <el-option label="100条/页" :value="100" />
      </el-select>
      <el-button-group>
        <el-button :disabled="currentPage === 1" @click="handlePageChange(1)">首页</el-button>
        <el-button :disabled="currentPage <= 5" @click="handlePageChange(currentPage - 5)">前5页</el-button>
        <el-button :disabled="currentPage === 1" @click="handlePageChange(currentPage - 1)">上一页</el-button>
        <el-button :disabled="currentPage === totalPages" @click="handlePageChange(currentPage + 1)">下一页</el-button>
        <el-button :disabled="currentPage + 5 > totalPages" @click="handlePageChange(currentPage + 5)">后5页</el-button>
        <el-button :disabled="currentPage === totalPages" @click="handlePageChange(totalPages)">末页</el-button>
      </el-button-group>
      <span class="page-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  total: number
  currentPage: number
  pageSize: number
}

const props = withDefaults(defineProps<Props>(), {
  total: 0,
  currentPage: 1,
  pageSize: 20
})

const emit = defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'size-change', size: number): void
}>()

const totalPages = computed(() => {
  return Math.ceil(props.total / props.pageSize) || 1
})

const handlePageChange = (page: number) => {
  emit('page-change', page)
}

const handleSizeChange = (size: number) => {
  emit('size-change', size)
}
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  margin-top: 20px;
}

.pagination-info {
  font-size: 14px;
  color: #606266;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-info {
  margin-left: 10px;
  font-size: 14px;
  color: #606266;
}
</style>
