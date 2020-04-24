<template>
  <div class="flex">
    <main class="w-100">
      <nav-bar />

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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
