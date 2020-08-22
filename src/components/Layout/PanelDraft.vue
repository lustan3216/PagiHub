<template>
  <div
    ref="panelDraft"
    class="editor"
  >
    <portal
      v-if="isDraftMode"
      to="nav-middle"
    >
      <function-bar />
    </portal>

    <sidebar-left v-if="isDraftMode" />

    <view-port class="view-port interact-view">
      <art-board />
    </view-port>

    <sidebar-right v-if="isDraftMode" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ViewPort from './ViewPort'
import ArtBoard from './ArtBoard'
import ComponentSet from '../Templates/ComponentSet'

export default {
  name: 'PanelDraft',
  components: {
    ArtBoard,
    ViewPort,
    ComponentSet,
    SidebarRight: () => import('@/components/Layout/SidebarRight'),
    SidebarLeft: () => import('@/components/Layout/SidebarLeft'),
    FunctionBar: () => import('@/components/Layout/FunctionBar'),
    PanelDraft: () => import('@/components/Layout/PanelDraft')
  },
  created() {
    if (this.$route.params.projectId) {
      this.getProject(this.$route.params.projectId).then(project => {
        if (project) {
          this.getAssets()
          this.initExamples()
        }
        else {
          this.$router.push('/projects')
        }
      })
    }

    window.addEventListener('resize', () => {
      this.artBoardResizing(true)
    })
  },
  methods: {
    ...mapActions('app', ['artBoardResizing']),
    ...mapActions('example', ['initExamples']),
    ...mapActions('component', ['getProject']),
    ...mapActions('asset', ['getAssets'])
  }
}
</script>

<style scoped lang="scss">
.editor {
  @include calc-vh('height', '100vh - 50px');
  display: flex;
  overflow: hidden;
  background-color: $color-grey;
}
.view-port {
  overflow: hidden;
  position: relative;
  flex: 1;
}
.interact-view {
  @include calc-vh('height', '100vh - 80px');
}
</style>
