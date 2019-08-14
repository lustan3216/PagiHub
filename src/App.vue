<template>
  <el-container>
    <sidebar-settings v-if="showSidebarSetting" />
    <sidebar-templates v-else />

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i
            class="el-icon-setting"
            style="margin-right: 15px" />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>王小虎</span>
      </el-header>

      <edit-area />
    </el-container>
  </el-container>
</template>

<script>
import EditArea from './components/EditArea'
import SidebarTemplates from './components/SidebarTemplates'
import SidebarSettings from './components/SidebarSettings'

export default {
  name: 'App',
  components: {
    SidebarSettings,
    SidebarTemplates,
    EditArea
  },
  computed: {
    showSidebarSetting() {
      return Object.keys(this.$observable.nodeForSetting).length
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
