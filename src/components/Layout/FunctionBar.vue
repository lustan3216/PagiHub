<template>
  <nav>
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
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'b']"
      @shortkey="vmCreateEmptyItem"
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

    <i
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'z']"
      @shortkey="UNDO"
      @click="UNDO"
    />

    <i
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'z']"
      @shortkey="REDO"
      @click="REDO"
    />

    <el-form
      ref="form"
      :disabled="!editingComponentSetId"
      class="align-center"
    >
      <dialog-component-tabs />

      <element-add-bar />

      <el-divider direction="vertical" />

      <el-tooltip
        effect="light"
        content="Preview"
        placement="bottom"
      >
        <el-button
          v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'p']"
          :disabled="!editingComponentSetId"
          icon="el-icon-video-camera"
          type="text"
          @click="SET_PREVIEW_MODE"
          @shortkey.native="SET_PREVIEW_MODE"
        />
      </el-tooltip>

      <el-tooltip
        effect="light"
        content="Publish"
        placement="bottom"
      >
        <dialog-publish />
      </el-tooltip>

      <el-divider direction="vertical" />

      <portal-target name="ViewPortController" />
    </el-form>
  </nav>
</template>

<script>
import { isMac } from '@/utils/device'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import DialogComponentSet from '../Setup/DialogComponentSet'
import { vmPasteNodes, vmRemoveNode, vmCreateEmptyItem } from '@/utils/vmMap'
import { arrayLast } from '@/utils/array'
import DialogPublish from '@/components/Setup/DialogPublish'
import ElementAddBar from '@/components/ComponentAdd/ElementAddBar'
import DialogComponentTabs from '@/components/ComponentAdd/DialogComponentTabs'

export default {
  name: 'FunctionBar',
  components: {
    DialogComponentSet,
    DialogPublish,
    ElementAddBar,
    DialogComponentTabs
  },
  computed: {
    ...mapState('app', ['copyComponentIds', 'selectedComponentIds']),
    ...mapState('node', ['editingComponentSetId']),
    ...mapGetters('mode', ['isProductionMode', 'isPreviewMode', 'isDraftMode']),
    ...mapGetters('app', [
      'selectedComponentNodes',
      'theOnlySelectedComponentId'
    ]),
    selected() {
      return this.selectedComponentIds.includes(this.id)
    }
  },
  methods: {
    ...mapActions('app', ['setCopySelectedNodeId']),
    ...mapMutations('mode', ['SET_PREVIEW_MODE']),
    ...mapMutations('node', ['REDO', 'UNDO']),
    isMac,
    vmPasteNodes,
    vmCreateEmptyItem() {
      vmCreateEmptyItem(arrayLast(this.selectedComponentNodes))
    },
    multiDelete() {
      this.selectedComponentNodes.forEach(node => vmRemoveNode(node))
    },
    cut() {
      this.setCopySelectedNodeId(this.selectedComponentIds)
      this.selectedComponentNodes.forEach(node => vmRemoveNode(node))
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
