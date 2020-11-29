<template>
  <component
    :class="{ 'cross-hair': isAdding }"
    :is="isDraftMode ? 'file-drop-zone' : 'div'"
  >
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
  </component>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { mobileAndTabletCheck } from '@/utils/device'
import ViewPort from './ViewPort'
import ArtBoard from './ArtBoard'
import SidebarLeft from '@/components/Layout/SidebarLeft'
import SidebarRight from '@/components/Layout/SidebarRight'
import { Message } from 'element-ui'

export default {
  name: 'PanelDraft',
  components: {
    ArtBoard,
    ViewPort,
    SidebarRight,
    SidebarLeft,
    FileDropZone: () => import('@/components/Layout/FileDropZone'),
    PreviewController: () => import('@/components/Layout/PreviewController'),
    FunctionBar: () => import('@/components/Layout/FunctionBar'),
    PanelDraft: () => import('@/components/Layout/PanelDraft'),
    DialogImageTabs: () => import('@/components/ComponentAdd/DialogImageTabs')
  },
  data() {
    return {
      isMobileOrTablet: false
    }
  },
  computed: {
    ...mapState('node', [
      'editingProjectId',
      'editingComponentSetId',
      'rootComponentSetIds'
    ]),
    ...mapState('app', ['isAdding']),
    ...mapState('asset', ['isImageDialogOpen'])
  },
  beforeMount() {
    if (mobileAndTabletCheck()) {
      this.$router.push({ name: 'Projects' })
      this.$nextTick(() => {
        Message.error({
          message: 'Sorry, The editor is not supporting mobile or tablet yet.',
          duration: 5000
        })
      })
    }
  },
  async created() {
    this.INIT_NODE_STORE()
    this.SET_DRAFT_MODE()

    // the very first moment to add proejct id, otherwise file-drop-zone will get null
    const { projectId } = this.$route.params

    if (projectId) {
      this.NODE_SET({ editingProjectId: projectId })
    }
  },
  methods: {
    ...mapMutations('node', { NODE_SET: 'SET' }),
    ...mapMutations('node', ['INIT_NODE_STORE']),
    ...mapMutations('mode', ['SET_DRAFT_MODE'])
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
