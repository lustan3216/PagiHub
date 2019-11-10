<template>
  <el-aside class="sidebar">
    <el-row>
      <el-col
        :span="6"
        :offset="18">
        <el-button
          type="text"
          @click="CLOSE_SIDEBAR">
          <v-icon name="times" />
        </el-button>
      </el-col>
    </el-row>

    <slot />
  </el-aside>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'CustomizedSidebar',
  methods: {
    ...mapMutations('layout', ['CLOSE_SIDEBAR'])
  }
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
