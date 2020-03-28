<template>
  <div class="flex">
    <main class="w-100">
      <nav-bar />

      <div class="main z-index1">
        <board-root />
      </div>
    </main>

    <sidebar-right />
  </div>
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
    BoardRoot,
    Splitpanes,
    Pane
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 0 15px;
  @include calc-vh(height, '100vh - 60px');
  overflow: scroll;
}
</style>
