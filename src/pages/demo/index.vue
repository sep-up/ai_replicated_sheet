<script lang="ts" setup>
import { getUserInfoApi } from '@/common/apis/users/index'
import CommonHeader from '@/components/CommonHeader/index.vue'

let userInfo: any = reactive({})
const nickname = ref('')
onMounted(async () => {
  // 接口测试
  const result: any = await getUserInfoApi()
  console.log('接口测试', result)
  if (result.data && result.data.code === '200') {
    userInfo = result.data.data
    nickname.value = userInfo.nickname
    console.log('userInfo', userInfo)
  }
})
</script>

<template>
  <div class="app-container">
    <CommonHeader />
    <div>
      <span>{{ nickname }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
