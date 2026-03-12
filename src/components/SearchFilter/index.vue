<template>
  <div class="search-filter">
    <el-form :model="searchParams" label-width="100px" :inline="true" v-show="!isCollapsed">
      <el-form-item label="生产订单编号">
        <el-input v-model="searchParams.productOrderNumber" placeholder="请输入生产订单编号" clearable style="width: 400px" />
      </el-form-item>
      <el-form-item label="生产工单编号">
        <el-input v-model="searchParams.workOrderNumber" placeholder="请输入生产工单编号" clearable style="width: 400px" />
      </el-form-item>
      <el-form-item label="生产车间">
        <el-input v-model="searchParams.workCenterName" placeholder="请输入生产车间" clearable style="width: 400px" />
      </el-form-item>
      <el-form-item label="物料编号">
        <el-input v-model="searchParams.materialCode" placeholder="请输入物料编号" clearable style="width: 400px" />
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input v-model="searchParams.materialName" placeholder="请输入物料名称" clearable style="width: 400px" />
      </el-form-item>
      <el-form-item label="作业员">
        <el-input v-model="searchParams.userNickname" placeholder="请输入作业员" clearable style="width: 400px" />
      </el-form-item>
      <el-form-item label="报工日期">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          @change="handleDateChange"
          style="width: 400px"
        />
      </el-form-item>
    </el-form>
    <el-form :model="searchParams" label-width="100px" :inline="true" v-show="isCollapsed">
      <el-form-item label="生产订单编号">
        <el-input v-model="searchParams.productOrderNumber" placeholder="请输入生产订单编号" clearable style="width: 400px" />
      </el-form-item>
      <el-form-item label="生产工单编号">
        <el-input v-model="searchParams.workOrderNumber" placeholder="请输入生产工单编号" clearable style="width: 400px" />
      </el-form-item>
    </el-form>
    <div class="filter-actions">
      <el-button @click="handleReset">重置</el-button>
      <el-button type="primary" :loading="loading" @click="handleSearch">查询</el-button>
      <el-button type="text" @click="toggleCollapse">
        {{ isCollapsed ? '展开' : '收起' }}
        <el-icon>
          <ArrowDown v-if="isCollapsed" />
          <ArrowUp v-else />
        </el-icon>
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import type { ReportListParams } from '@/common/apis/report/type'

interface Props {
  loading: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  (e: 'search', params: Partial<ReportListParams>): void
  (e: 'reset'): void
}>()

const isCollapsed = ref(false)
const dateRange = ref<string[]>([])
const searchParams = reactive({
  productOrderNumber: '',
  workOrderNumber: '',
  workCenterName: '',
  materialCode: '',
  materialName: '',
  userNickname: '',
  startDate: '',
  endDate: ''
})

const handleDateChange = (val: string[] | null) => {
  if (val) {
    searchParams.startDate = val[0]
    searchParams.endDate = val[1]
  } else {
    searchParams.startDate = ''
    searchParams.endDate = ''
  }
}

const handleSearch = () => {
  emit('search', { ...searchParams })
}

const handleReset = () => {
  Object.keys(searchParams).forEach(key => {
    searchParams[key as keyof typeof searchParams] = ''
  })
  dateRange.value = []
  emit('reset')
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style lang="scss" scoped>
.search-filter {
  padding: 10px 20px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 10px;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 6px;
  gap: 10px;
}
</style>
