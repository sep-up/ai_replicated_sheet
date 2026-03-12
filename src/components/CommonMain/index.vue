<script lang="ts" setup>
onMounted(() => {
  try {
    if (!window.flutter_inappwebview) {
      return
    }
    const main = document.querySelector('.main-content') as any
    window.flutter_inappwebview.callHandler('closeBarheight').then((res: string | number) => {
      window.flutter_inappwebview.callHandler('appBarheight').then((res2: string | number) => {
        main.style.top = `${Number(res) + Number(res2)}px`
      })
    })
  } catch (err) {
    console.log(err)
  }
})
</script>

<template>
  <div class="main-content">
    <div class="slot">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .main-content {
  width: 100%;
  height: 0;
  flex: 1 0 auto;
  padding: 12px 12px 0 12px;
  box-sizing: border-box;
  background: #f5f8f9;
  .slot {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
