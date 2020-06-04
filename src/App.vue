<template>
  <div class="app">
    <function-bar v-if="isDraftMode" />

    <main
      class="flex1 relative over-hidden"
      style="background-color:#f4f8fb;"
    >
      <panel-draft />
    </main>

    <sidebar-right v-if="isDraftMode" />
  </div>
</template>

<script>
import FunctionBar from './components/Layout/FunctionBar'
import PanelDraft from './components/Layout/PanelDraft'

export default {
  name: 'App',
  components: {
    SidebarRight: () => import('./components/Layout/SidebarRight'),
    FunctionBar,
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
  display: flex;
}
</style>
