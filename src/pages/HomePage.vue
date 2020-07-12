<template>
  <div class="app">
    <function-bar v-if="isDraftMode" />
    <main class="flex1 relative over-hidden">
      <panel-draft />
    </main>

    <sidebar-right v-if="isDraftMode" />
  </div>
</template>

<script>
  export default {
    name: 'App',
    components: {
      SidebarRight: () => import('@/components/Layout/SidebarRight'),
      FunctionBar: () => import('@/components/Layout/FunctionBar'),
      PanelDraft: () => import('@/components/Layout/PanelDraft')
    }
  }
</script>

<style lang="scss">
  .app {
    @include calc-vh('height', '100vh - 40px');
    display: flex;
  }
</style>
