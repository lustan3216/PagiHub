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

    <portal-target
      v-for="id in selectedComponentIds"
      :name="`Interface-${id}`"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Interface',
  components: {
    SidebarRight: () => import('@/components/Layout/SidebarRight'),
    SidebarLeft: () => import('@/components/Layout/SidebarLeft'),
    FunctionBar: () => import('@/components/Layout/FunctionBar'),
    PanelDraft: () => import('@/components/Layout/PanelDraft')
  },
  computed: {
    ...mapState('app', ['selectedComponentIds'])
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
