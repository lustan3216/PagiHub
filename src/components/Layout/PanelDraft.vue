<template>
  <file-drop-zone>
    <function-bar v-if="isDraftMode" />

    <div
      ref="panelDraft"
      :class="{ draft: isDraftMode }"
      class="editor"
    >
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
              :id="editingComponentSetId"
              :key="editingComponentSetId"
              class="draft-artboard"
            />

          </keep-alive>
        </transition>
      </view-port>

      <dialog-image-tabs
        v-if="isDraftMode"
        :visible="isImageDialogOpen"
      />

      <sidebar-right v-if="isDraftMode" />

      <preview-controller v-if="isPreviewMode" />
    </div>
  </file-drop-zone>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import ViewPort from './ViewPort'
import ArtBoard from './ArtBoard'
import SidebarLeft from '@/components/Layout/SidebarLeft'
import SidebarRight from '@/components/Layout/SidebarRight'
import FileDropZone from '@/components/TemplateUtils/FileDropZone'

export default {
  name: 'PanelDraft',
  components: {
    ArtBoard,
    ViewPort,
    SidebarRight,
    SidebarLeft,
    FileDropZone,
    PreviewController: () => import('@/components/Layout/PreviewController'),
    FunctionBar: () => import('@/components/Layout/FunctionBar'),
    PanelDraft: () => import('@/components/Layout/PanelDraft'),
    DialogImageTabs: () => import('@/components/ComponentAdd/DialogImageTabs')
  },
  computed: {
    ...mapState('node', [
      'editingProjectId',
      'editingComponentSetId',
      'rootComponentSetIds'
    ]),
    ...mapState('asset', ['isImageDialogOpen']),
  },
  async created() {
    this.INIT_NODE_STORE()
    this.SET_DRAFT_MODE()
    this.NODE_SET({ editingComponentSetId: null })

    const { projectId } = this.$route.params
    if (projectId) {
      this.NODE_SET({ editingProjectId: projectId })
      this.getAssets(projectId)
    }
    else {
      this.$router.push({ name: 'Dashboard' })
    }
  },
  methods: {
    ...mapMutations('node', ['INIT_NODE_STORE']),
    ...mapMutations('node', { NODE_SET: 'SET' }),
    ...mapMutations('mode', ['SET_DRAFT_MODE']),
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
  @include calc-vh('height', '100vh - 45px');
}
</style>
