<template>
  <el-container>
    <el-header class="header">
      <nav-bar />
    </el-header>

    <el-container class="main">
      <transition
        name="fade-left"
        mode="out-in">
        <component :is="$observable.currentSidebar" />
      </transition>

      <el-container>
        <el-main>
          <edit-area />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import NavBar from './components/Layout/NavBar'
import EditArea from './components/EditArea'
import SidebarTemplates from './components/Layout/SidebarTemplates'
import SidebarSettings from './components/Layout/SidebarSettings'

export default {
  name: 'App',
  components: {
    EditArea,
    NavBar,
    SidebarTemplates,
    SidebarSettings
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #eff1f2;
  box-shadow: 0 2px 5px 0 rgba(32, 48, 60, 0.05);
  font-size: 14px;
  position: relative;
}

.main {
  @include calc-vh(min-height, '100vh - 60px');
}
</style>
