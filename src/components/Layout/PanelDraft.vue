<template>
  <div
    ref="panelDraft"
    :class="{ draft: isDraftMode }"
    class="editor"
  >
    <portal
      v-if="isDraftMode"
      to="nav-middle"
    >
      <function-bar />
    </portal>

    <sidebar-left v-if="isDraftMode" />

    <view-port
      :class="{ draft: isDraftMode }"
      style="flex: 1"
    >
      <art-board />
    </view-port>

    <sidebar-right v-if="isDraftMode" />

    <preview-controller v-if="isPreviewMode" />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import ViewPort from './ViewPort'
import ArtBoard from './ArtBoard'
import ComponentSet from '../Templates/ComponentSet'

export default {
  name: 'PanelDraft',
  components: {
    ArtBoard,
    ViewPort,
    ComponentSet,
    PreviewController: () => import('@/components/Layout/PreviewController'),
    SidebarRight: () => import('@/components/Layout/SidebarRight'),
    SidebarLeft: () => import('@/components/Layout/SidebarLeft'),
    FunctionBar: () => import('@/components/Layout/FunctionBar'),
    PanelDraft: () => import('@/components/Layout/PanelDraft')
  },
  created() {
    if (this.isDraftMode) {
      this.initExamples()

      // this.getProject(this.$route.params.projectId).then(project => {
      //   if (project) {
      //     this.getAssets()
      //
      //   }
      //   else {
      //     this.$router.push('/projects')
      //   }
      // })
    }
  },
  methods: {
    ...mapMutations('mode', ['SET_DRAFT_MODE']),
    ...mapActions('example', ['initExamples']),
    ...mapActions('node', ['getProject']),
    ...mapActions('asset', ['getAssets'])
  }
}
</script>

<style scoped lang="scss">
.editor {
  display: flex;
  overflow: hidden;
  background-color: $color-grey;
}
.draft.editor {
  @include calc-vh('height', '100vh - 50px');
}
</style>
