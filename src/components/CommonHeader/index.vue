<!--
 * @Date: 2025-06-25 14:45:18
 * @LastEditors: shucai
 * @LastEditTime: 2025-06-25 16:07:00
 * @FilePath: \v3-admin-vite\src\components\CommonHeader\index.vue
-->
<script lang="ts" setup>
/** ************通用小程序頂部固定欄 */
import { defineProps } from 'vue'

const { title = '标题', isShowBack = true } = defineProps({
  // 标题
  title: {
    type: String
  },
  // 是否显示返回按钮
  isShowBack: {
    type: Boolean
  }
})
const router = useRouter()
onMounted(() => {
  try {
    if (!window.flutter_inappwebview) {
      return
    }
    const header = document.querySelector('.header') as any
    // 获取顶部通知栏高度
    window.flutter_inappwebview.callHandler('appBarheight').then((res1: string | number) => {
      header.style.paddingTop = `${res1}px`
    })
  } catch (err) {
    console.log(err)
  }
})
function back() {
  router.go(-1)
}
</script>

<template>
  <div class="header">
    <section class="container">
      <img v-if="isShowBack" style="margin-left: 10px" src="@@/assets/images/back-arrow.png" alt="" @click="back">
      <span class="title">{{ title }}</span>
    </section>
  </div>
</template>

<style lang="scss" scoped>
  .header {
  width: 100%;
  background: #548af1;
  opacity: 1;
  .container {
    width: 100%;
    height: 45px;
    position: relative;
    .title,
    img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #fff;
    }
    img {
      left: 20px;
    }
  }
}
</style>
