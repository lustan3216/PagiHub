<template>
  <el-container>
    <splitpanes class="default-theme">
      <pane size="20">
        <sidebar-left />
      </pane>

      <pane>
        <nav-bar />

        <el-main class="main">
          <board-root class="edit-area" />
        </el-main>
      </pane>
    </splitpanes>

    <sidebar-right />
  </el-container>
</template>

<script>
import 'splitpanes/dist/splitpanes.css'
import { Splitpanes, Pane } from 'splitpanes'
import NavBar from './components/Layout/NavBar'
import BoardRoot from './components/Layout/BoardRoot'

export default {
  name: 'App',
  components: {
    NavBar,
    SidebarRight: () => import('./components/Layout/SidebarRight'),
    SidebarLeft: () => import('./components/Layout/SidebarLeft'),
    BoardRoot,
    Splitpanes,
    Pane
  }
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  @include calc-vh(height, '100vh - 40px');
  overflow: scroll;
}
</style>
