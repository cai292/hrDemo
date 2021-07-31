<template>
  <div>
    <!-- 放置一个svg的图标 -->
    <svg-icon
      icon-class="fullscreen"
      style="color:#fff; width: 20px; height: 20px"
      @click="changeScreen"
    />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  methods: {
    // 改为全屏
    changeScreen() {
      if (!ScreenFull.isEnabled) {
        return this.$message.warning('浏览器不支持')
      }
      //   如果可用 就可以全屏
      ScreenFull.toggle()
    }
  }
}
</script>

<style>

</style>
