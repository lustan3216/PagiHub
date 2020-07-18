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
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    SidebarRight: () => import('@/components/Layout/SidebarRight'),
    FunctionBar: () => import('@/components/Layout/FunctionBar'),
    PanelDraft: () => import('@/components/Layout/PanelDraft')
  },
  created() {
    const { projectId } = this.$route.params
    if (projectId) {
      this.getComponentSets(projectId)
      this.projectSet({
        editingProjectId: projectId
      })
    }
  },
  methods: {
    ...mapMutations('project', {
      projectSet: 'SET'
    }),
    ...mapActions('project', ['getComponentSets'])
  }
}
</script>

<style lang="scss">
.app {
  @include calc-vh('height', '100vh - 40px');
  display: flex;
}
</style>
