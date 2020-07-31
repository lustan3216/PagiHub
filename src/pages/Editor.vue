<template>
  <div class="editor">
    <portal
      v-if="isDraftMode"
      to="nav-middle"
    >
      <function-bar />
    </portal>

    <sidebar-left v-if="isDraftMode" />

    <main class="flex1 relative over-hidden">
      <panel-draft />
    </main>

    <sidebar-right v-if="isDraftMode" />
  </div>
</template>

<script>
export default {
  name: 'Editor',
  components: {
    SidebarRight: () => import('@/components/Layout/SidebarRight'),
    SidebarLeft: () => import('@/components/Layout/SidebarLeft'),
    FunctionBar: () => import('@/components/Layout/FunctionBar'),
    PanelDraft: () => import('@/components/Layout/PanelDraft')
  }
}
</script>

<style lang="scss">
.editor {
  @include calc-vh('height', '100vh - 50px');
  display: flex;
  overflow: hidden;
  background-color: $color-grey;
}
</style>
