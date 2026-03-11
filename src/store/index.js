import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReportStore = defineStore('report', () => {
  const tableData = ref([])
  const totalElements = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const searchParams = ref({
    productOrderNumber: '',
    workOrderNumber: '',
    workCenterName: '',
    materialCode: '',
    materialName: '',
    userNickname: '',
    startDate: '',
    endDate: ''
  })
  const columnConfig = ref([])
  const loading = ref(false)

  function setTableData(data) {
    tableData.value = data
  }

  function setTotalElements(total) {
    totalElements.value = total
  }

  function setCurrentPage(page) {
    currentPage.value = page
  }

  function setPageSize(size) {
    pageSize.value = size
  }

  function setSearchParams(params) {
    searchParams.value = { ...searchParams.value, ...params }
  }

  function resetSearchParams() {
    searchParams.value = {
      productOrderNumber: '',
      workOrderNumber: '',
      workCenterName: '',
      materialCode: '',
      materialName: '',
      userNickname: '',
      startDate: '',
      endDate: ''
    }
  }

  function setColumnConfig(config) {
    columnConfig.value = config
  }

  function setLoading(status) {
    loading.value = status
  }

  return {
    tableData,
    totalElements,
    currentPage,
    pageSize,
    searchParams,
    columnConfig,
    loading,
    setTableData,
    setTotalElements,
    setCurrentPage,
    setPageSize,
    setSearchParams,
    resetSearchParams,
    setColumnConfig,
    setLoading
  }
})
