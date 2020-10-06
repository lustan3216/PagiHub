<template>
  <div
    ref="panelDraft"
    :class="{ draft: isDraftMode }"
    class="editor"
  >
    <portal
      v-if="isDraftMode"
      to="NavMiddle"
    >
      <function-bar />
    </portal>

    <sidebar-left v-if="isDraftMode" />

    <view-port
      :class="{ draft: isDraftMode }"
      style="flex: 1"
    >
      <art-board
        v-if="editingComponentSetId"
        :id="editingComponentSetId"
      />
    </view-port>

    <sidebar-right v-if="isDraftMode" />

    <preview-controller v-if="isPreviewMode" />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import ViewPort from './ViewPort'
import ArtBoard from './ArtBoard'
import ComponentSet from '../Templates/ComponentSet'
import localforage from 'localforage'

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
  computed: {
    ...mapState('node', ['editingProjectId', 'editingComponentSetId'])
  },
  async created() {
    this.SET_DRAFT_MODE()
    const { projectId } = this.$route.params

    if (projectId) {
      this.NODE_SET({ editingProjectId: projectId })
    }
    else {
      this.$router.push({ name: 'Dashboard' })
    }

    if (this.isDraftMode) {
      this.initExamples()
    }
  },
  mounted() {
    document.addEventListener(
      'scroll',
      e => {
        if (!this.isDraftMode) {
          return
        }

        this.LAYOUT_SET({ gridResizing: true })
        this.resizeNodeQuickFn()
      },
      true
    )
  },
  methods: {
    ...mapMutations('node', { NODE_SET: 'SET' }),
    ...mapMutations('layout', { LAYOUT_SET: 'SET' }),
    ...mapMutations('mode', ['SET_DRAFT_MODE']),
    ...mapActions('example', ['initExamples']),
    ...mapActions('layout', ['resizeNodeQuickFn'])
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
