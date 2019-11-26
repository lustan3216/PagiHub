<template>
  <el-aside class="sidebar">
    <slot />
  </el-aside>
</template>

<script>
export default {
  name: 'FlexSidebar'
}
</script>

<style scoped lang="scss">
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: inherit;
}

::v-deep {
  .el-menu {
    border-right: none;
  }
  .el-submenu .el-menu-item {
    height: inherit;
  }
}
.sidebar {
  background-color: #fff;
  box-shadow: 2px 0px 5px 0 rgba(32, 48, 60, 0.05);
  width: 350px !important;
}
</style>
