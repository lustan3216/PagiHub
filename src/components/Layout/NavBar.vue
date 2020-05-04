<template>
  <dialog-interacted
    v-if="isPreviewMode"
    :resizable="false"
    class="preview"
  >
    <portal-target
      name="ViewPort"
      class="inline-block m-l-15 box-shadow"
    />

    <el-tooltip
      effect="light"
      content="Close Preview"
      placement="right"
    >
      <el-button
        v-shortkey="['esc']"
        icon="el-icon-close"
        circle
        class="box-shadow m-l-15"
        @click="SET_DRAFT_MODE"
        @shortkey.native="SET_DRAFT_MODE"
      />
    </el-tooltip>
  </dialog-interacted>

  <nav
    v-else-if="isDraftMode"
    class="flex"
  >
    <panel-nodes
      v-if="nodesVisible"
      class="panel"
    />

    <panel-project
      v-if="projectVisible"
      class="panel"
    />

    <div class="icons">
      <el-tooltip
        ref="1"
        effect="light"
        content="Preview"
        placement="right"
      />
      <el-button
        v-popover:1
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'p']"
        icon="el-icon-data-analysis"
        type="text"
        @click="SET_PREVIEW_MODE"
        @shortkey.native="SET_PREVIEW_MODE"
      />

      <my-space />

      <el-tooltip
        ref="2"
        effect="light"
        content="Undo"
        placement="right"
      />
      <el-button
        v-popover:2
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'z']"
        type="text"
        icon="el-icon-refresh-left"
        @shortkey.native="UNDO"
        @click="UNDO"
      />

      <el-tooltip
        ref="3"
        effect="light"
        content="Redo"
        placement="right"
      />
      <el-button
        v-popover:3
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'z']"
        type="text"
        icon="el-icon-refresh-right"
        @shortkey.native="REDO"
        @click="REDO"
      />

      <el-tooltip
        ref="4"
        effect="light"
        content="Nodes"
        placement="right"
      />
      <el-button
        v-popover:4
        v-shortkey="['z']"
        type="text"
        icon="el-icon-grape"
        style="transform: rotate(180deg)"
        @shortkey.native="nodesIconClick"
        @click="nodesIconClick"
      />

      <el-tooltip
        ref="5"
        effect="light"
        content="Project"
        placement="right"
      />
      <el-button
        v-popover:5
        v-shortkey="['x']"
        type="text"
        icon="el-icon-takeaway-box"
        @shortkey.native="projectIconClick"
        @click="projectIconClick"
      />

      <el-tooltip
        ref="6"
        effect="light"
        content="Copy"
        placement="right"
      />
      <el-button
        v-popover:6
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'c']"
        type="text"
        icon="el-icon-document-copy"
        @shortkey.native="copy"
        @click="copy"
      />

      <el-tooltip
        v-if="copyComponentIds.length && selected"
        effect="light"
        content="Paste Component"
        placement="bottom"
      >
        <el-button
          v-shortkey="[isMac ? 'meta' : 'ctrl', 'v']"
          type="text"
          icon="el-icon-document-add"
          size="small"
          @click="vmPasteCopyComponents(id)"
          @shortkey.native="multiPaste"
        />
      </el-tooltip>

      <el-button
        type="text"
        icon="el-icon-copy-document"
        @click.stop="() => vmCopyNode(node)"
      />

      <el-button
        v-shortkey="{ del: ['del'], del: ['backspace'] }"
        type="text"
        icon="el-icon-delete"
        @shortkey.native="multiDelete"
        @click.stop="() => multiDelete"
      />

      <el-popover
        ref="7"
        effect="light"
        trigger="hover"
        placement="right"
      >
        <span>Are u sure to Publish？</span>
        <el-button
          type="info"
          icon="el-icon-circle-check"
          circle
          @click="publish"
        />
      </el-popover>
      <el-button
        v-popover:7
        type="text"
        icon="el-icon-upload"
      />
    </div>
  </nav>
</template>

<script>
import { isMac } from '@/utils/device'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { Message } from 'element-ui'
import DialogInteracted from '@/components/Components/DialogInteracted'
import DialogComponentSet from '../Setup/DialogComponentSet'
import MySpace from './MySpace'
import PanelNodes from '../Setup/PanelNodes'
import PanelProject from '../Setup/PanelProject'
import {
  vmAddNodesToParentAndRecord,
  vmCopyNode,
  vmCreateItem,
  vmPasteCopyComponents,
  vmRemoveNode
} from '@/utils/vmMap'
import jsonHistory from '@/store/jsonHistory'

export default {
  name: 'NavBar',
  components: {
    MySpace,
    PanelNodes,
    PanelProject,
    DialogInteracted,
    DialogComponentSet
  },
  data() {
    return {
      nodesVisible: false,
      projectVisible: false
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds', 'copyComponentIds']),
    ...mapGetters('mode', ['isProductionMode', 'isPreviewMode', 'isDraftMode']),
    selected() {
      return this.selectedComponentIds.includes(this.id)
    },
    selectedNodes() {
      return this.selectedComponentIds.map(id => this.draftNodesMap[id])
    }
  },
  methods: {
    ...mapMutations('app', ['SET_COPY_SELECTED_COMPONENT_IDS']),
    ...mapMutations('mode', ['SET_PREVIEW_MODE', 'SET_DRAFT_MODE']),
    ...mapMutations('draft', ['REDO', 'UNDO']),
    isMac,
    publish() {},
    copy() {
      this.SET_COPY_SELECTED_COMPONENT_IDS()
      const length = this.copyComponentIds.length
      if (length) {
        Message.info(`Copy ${length} Components`)
      }
    },
    nodesIconClick() {
      this.nodesVisible = !this.nodesVisible
      this.projectVisible = false
    },
    projectIconClick() {
      this.nodesVisible = false
      this.projectVisible = !this.projectVisible
    },
    vmCreateItem,
    vmCopyNode,
    vmRemoveNode,
    vmPasteCopyComponents,
    vmAddNodesToParentAndRecord,
    multiPaste() {
      jsonHistory.current.recordsMerge(() => {
        this.selectedNodes.forEach(node => this.vmPasteCopyComponents(node.id))
      })
    },
    multiDelete() {
      jsonHistory.current.recordsMerge(() => {
        this.selectedNodes.forEach(node => this.vmRemoveNode(node))
      })
    }
  }
}
</script>

<style scoped lang="scss">
nav {
  text-align: center;
  top: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  z-index: 1000;
  background-color: #fff;
  opacity: 0.9;
  box-shadow: 0 0 15px 0 rgba(32, 48, 60, 0.11);
}
.el-button {
  font-size: 16px;
  padding: 7px;
  margin: 10px 0 0;
}
.preview {
  position: fixed;
  left: 35%;
  z-index: 10;
}
.icons {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.panel {
  width: 300px;
  padding: 5px;
}
</style>
