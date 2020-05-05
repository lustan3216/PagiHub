<template>
  <div class="app">
    <nav-bar />

    <main class="z-index1 relative main">
      <panel-production v-if="isProductionMode" />
      <panel-draft v-else />
    </main>

    <sidebar-right v-if="isDraftMode" />
  </div>
</template>

<script>
import NavBar from './components/Layout/NavBar'
import PanelProduction from './components/Layout/PanelProduction'
import PanelDraft from './components/Layout/PanelDraft'

export default {
  name: 'App',
  components: {
    NavBar,
    SidebarRight: () => import('./components/Layout/SidebarRight'),
    PanelProduction,
    PanelDraft
  }
}
</script>

<style lang="scss">
.app {
  font-family: Helvetica, Arial, 'PingFang HK', '.PingFang-SC-Regular', PingFang,
    'Hiragino Sans GB', STHeiti, 'Microsoft JhengHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  @include calc-vh('height', 100vh);
}
</style>
