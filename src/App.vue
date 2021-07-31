<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss" >
body{
  min-width: 1366px;
  overflow-y: auto !important;
  padding-right: 0 !important;
}
.el-tabs__item{
  font-size: 20px;
margin: 5px 5px 5px 0;

}
</style>
