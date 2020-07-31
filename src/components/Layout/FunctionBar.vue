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
      v-if="isPreviewMode"
      effect="light"
      content="Close Preview"
      placement="bottom"
    >
      <el-button
        v-shortkey="['esc']"
        icon="el-icon-close"
        circle
        class="shadow-button m-l-15"
        @click="SET_DRAFT_MODE"
        @shortkey.native="SET_DRAFT_MODE"
      />
    </el-tooltip>
  </dialog-interacted>

  <nav v-else-if="isDraftMode">
    <el-tooltip
      effect="light"
      content="Undo"
      placement="bottom"
    >
      <el-button
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'z']"
        type="text"
        icon="el-icon-refresh-left"
        @shortkey.native="UNDO"
        @click="UNDO"
      />
    </el-tooltip>

    <el-tooltip
      effect="light"
      content="Redo"
      placement="bottom"
    >
      <el-button
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'z']"
        type="text"
        icon="el-icon-refresh-right"
        @shortkey.native="REDO"
        @click="REDO"
      />
    </el-tooltip>

    <el-tooltip
      effect="light"
      content="Copy"
      placement="bottom"
    >
      <el-button
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'c']"
        :disabled="!selectedComponentIds.length"
        type="text"
        icon="el-icon-document-copy"
        @shortkey.native="copy"
        @click="copy"
      />
    </el-tooltip>

    <el-tooltip
      effect="light"
      content="Paste Component"
      placement="bottom"
    >
      <el-button
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'v']"
        :disabled="!copyComponentIds.length"
        type="text"
        icon="el-icon-document-add"
        size="small"
        @click="multiPaste"
        @shortkey.native="multiPaste"
      />
    </el-tooltip>

    <el-tooltip
      effect="light"
      content="Cut Component"
      placement="bottom"
    >
      <el-button
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'x']"
        :disabled="!selectedComponentNode"
        type="text"
        icon="el-icon-scissors"
        size="small"
        @click="cut"
        @shortkey.native="cut"
      />
    </el-tooltip>

    <el-button
      v-shortkey="{ del: ['del'], del: ['backspace'] }"
      :disabled="!selectedComponentIds.length"
      type="text"
      icon="el-icon-delete"
      @shortkey.native="multiDelete"
      @click.stop="() => multiDelete"
    />

    <el-tooltip
      effect="light"
      content="Preview"
      placement="bottom"
    >
      <el-button
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'p']"
        :disabled="!editingComponentSetId"
        icon="el-icon-data-analysis"
        type="text"
        @click="SET_PREVIEW_MODE"
        @shortkey.native="SET_PREVIEW_MODE"
      />
    </el-tooltip>

    <el-button
      :disabled="!editingComponentSetId"
      type="text"
      icon="el-icon-upload"
    />
  </nav>
</template>

<script>
import { isMac } from '@/utils/device'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { Message } from 'element-ui'
import DialogInteracted from '@/components/Components/DialogInteracted'
import DialogComponentSet from '../Setup/DialogComponentSet'
import { Tooltip } from 'element-ui'

import {
  vmAddNodesToParentAndRecord,
  vmCopyNode,
  vmCreateItem,
  vmPasteCopyComponents,
  vmRemoveNode
} from '@/utils/vmMap'
import jsonHistory from '@/store/jsonHistory'

export default {
  name: 'FunctionBar',
  components: {
    DialogInteracted,
    DialogComponentSet,
    ElTooltip: Tooltip
  },
  computed: {
    ...mapState('app', [
      'copyComponentIds',
      'selectedComponentIds',
      'selectedComponentNode'
    ]),
    ...mapState('component', ['editingComponentSetId']),
    ...mapGetters('mode', ['isProductionMode', 'isPreviewMode', 'isDraftMode']),
    selected() {
      return this.selectedComponentIds.includes(this.id)
    },
    selectedNodes() {
      return this.selectedComponentIds.map(id => this.componentsMap[id])
    }
  },
  methods: {
    ...mapActions('app', ['setCopySelectedNodeId']),
    ...mapMutations('mode', ['SET_PREVIEW_MODE', 'SET_DRAFT_MODE']),
    ...mapMutations('component', ['REDO', 'UNDO']),
    isMac,
    publish() {},
    copy() {
      this.setCopySelectedNodeId()
      const length = this.copyComponentIds.length
      if (length) {
        Message.info(`Copy ${length} Components`)
      }
    },
    vmCreateItem,
    vmCopyNode,
    vmRemoveNode,
    vmPasteCopyComponents,
    vmAddNodesToParentAndRecord,
    multiPaste() {
      jsonHistory.recordsMerge(() => {
        this.copyComponentIds.forEach(id =>
          this.vmCopyNode(this.componentsMap[id])
        )
      })
    },
    multiDelete() {
      jsonHistory.recordsMerge(() => {
        this.selectedNodes.forEach(node => this.vmRemoveNode(node))
      })
    },
    cut() {}
  }
}
</script>

<style scoped lang="scss">
nav {
  text-align: center;
  z-index: 200;
}

.el-button {
  font-size: 16px;
  padding: 7px;
  margin: 5px 10px;
}
</style>
