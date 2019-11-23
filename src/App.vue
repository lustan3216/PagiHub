<template>
  <el-container>
    <el-aside width="40px" class="vertical-header">
      <nav-bar />
    </el-aside>

    <el-container class="main">
      <transition name="fade-left" mode="out-in">
        <component :is="currentSidebar.type" />
      </transition>

      <el-container>
        <el-main class="main">
          <board-root />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
import NavBar from './components/Layout/NavBar'
import SidebarNodesTree from './components/Layout/SidebarNodesTree'
import SidebarSettings from './components/Layout/SidebarSettings'
import EditArea from './components/Templates/AreaDraggable'
import BoardRoot from './components/Layout/BoardRoot'

export default {
  name: 'App',
  components: {
    EditArea,
    NavBar,
    SidebarNodesTree,
    SidebarSettings,
    BoardRoot
  },
  computed: {
    ...mapState('layout', ['currentSidebar'])
  }
}
</script>

<style lang="scss" scoped>
.vertical-header {
  background-color: #fff;
  border-bottom: 1px solid #eff1f2;
  box-shadow: 0 2px 5px 0 rgba(32, 48, 60, 0.05);
  font-size: 14px;
  position: relative;
}

.main {
  @include calc-vh(height, '100vh');
  overflow: scroll;
}

.edit-area {
  padding-top: 35px;
  @include calc-vh(min-height, '100vh - 75px');
}
</style>
