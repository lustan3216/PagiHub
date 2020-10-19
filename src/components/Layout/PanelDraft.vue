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
      <transition
        name="slide"
        mode="out-in"
      >
        <keep-alive :include="rootComponentSetIds">
          <art-board
            v-if="editingComponentSetId"
            :id="editingComponentSetId"
            :key="editingComponentSetId"
          />
        </keep-alive>
      </transition>
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

let timeId
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
    ...mapState('node', [
      'editingProjectId',
      'editingComponentSetId',
      'rootComponentSetIds'
    ])
  },
  async created() {
    this.SET_DRAFT_MODE()
    this.NODE_SET({ editingComponentSetId: null })
    const { projectId } = this.$route.params

    if (projectId) {
      this.NODE_SET({ editingProjectId: projectId })
      this.getAssets()
    }
    else {
      this.$router.push({ name: 'Dashboard' })
    }
  },
  mounted() {
    document.addEventListener(
      'scroll',
      e => {
        if (!this.isDraftMode) {
          return
        }
        clearTimeout(timeId)

        this.LAYOUT_SET({ gridResizing: true })
        timeId = setTimeout(() => {
          this.resizeNodeQuickFn()
          timeId = null
        }, 50)
      },
      true
    )
  },
  methods: {
    ...mapMutations('node', { NODE_SET: 'SET' }),
    ...mapMutations('layout', { LAYOUT_SET: 'SET' }),
    ...mapMutations('mode', ['SET_DRAFT_MODE']),
    ...mapActions('layout', ['resizeNodeQuickFn']),
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
