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
    <i
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'c']"
      :disabled="!selectedComponentIds.length"
      @shortkey="setCopySelectedNodeId(null)"
    />

    <i
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'v']"
      :disabled="!copyComponentIds.length"
      @shortkey="vmPasteNodes"
    />

    <i
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'x']"
      :disabled="selectedComponentIds.length !== 1"
      @shortkey="cut"
    />

    <i
      v-shortkey="{ del: ['del'], del: ['backspace'] }"
      :disabled="!selectedComponentIds.length"
      @shortkey="multiDelete"
    />

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

    <i class="dot"/>

    <view-port-controller />

    <i class="dot"/>

    <el-tooltip
      effect="light"
      content="Preview"
      placement="bottom"
    >
      <el-button
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'p']"
        :disabled="!editingComponentSetId"
        icon="el-icon-picture-outline"
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
import DialogInteracted from '@/components/Components/DialogInteracted'
import DialogComponentSet from '../Setup/DialogComponentSet'
import ViewPortController from '../TemplateUtils/ViewPortController'
import { vmPasteNodes, vmRemoveNode } from '@/utils/vmMap'
import jsonHistory from '@/store/jsonHistory'

export default {
  name: 'FunctionBar',
  components: {
    ViewPortController,
    DialogInteracted,
    DialogComponentSet
  },
  computed: {
    ...mapState('app', [
      'copyComponentIds',
      'selectedComponentIds'
    ]),
    ...mapState('component', ['editingComponentSetId', 'selectedComponentNode']),
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
    vmPasteNodes,
    multiDelete() {
      jsonHistory.recordsMerge(() => {
        this.selectedNodes.forEach(node => vmRemoveNode(node))
      })
    },
    cut() {
      this.setCopySelectedNodeId(this.selectedComponentNode.id)
      vmRemoveNode(this.selectedComponentNode)
    }
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

.dot {
  width: 2px;
  height: 2px;
  background-color: #b1b1b1;
  border-radius: 50%;
  margin: 4px 8px;
  display: inline-block;
}
</style>
