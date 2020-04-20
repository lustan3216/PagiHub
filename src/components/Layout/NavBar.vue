<template>
  <dialog-interacted
    v-if="isPreviewMode"
    :resizable="false"
    class="preview"
  >
    <portal-target
      name="view-port-controller"
      class="d-inline-block m-l-15 box-shadow"
    />

    <el-tooltip
      effect="light"
      content="Close Preview"
      placement="bottom"
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
    class="flex-center"
  >
    <portal-target
      name="view-port-controller"
      class="d-inline-block m-l-15"
    />

    <el-tooltip
      effect="light"
      content="Preview"
      placement="bottom"
    >
      <el-button
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'p']"
        icon="el-icon-data-analysis"
        type="text"
        @click="SET_PREVIEW_MODE"
        @shortkey.native="SET_PREVIEW_MODE"
      />
    </el-tooltip>

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
        type="text"
        icon="el-icon-document-copy"
        @shortkey.native="copy"
        @click="copy"
      />
    </el-tooltip>

    <el-popover
      effect="light"
      trigger="hover"
      placement="bottom"
      class="m-l-10"
    >
      <span>Are u sure to Publish？</span>
      <el-button
        type="info"
        icon="el-icon-circle-check"
        circle
        @click="publish"
      />

      <el-button
        slot="reference"
        type="text"
        icon="el-icon-upload"
      />
    </el-popover>
  </nav>
</template>

<script>
import { isMac } from '@/utils/device'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { Message } from 'element-ui'
import DialogInteracted from '@/components/Components/DialogInteracted'
import DialogComponentSet from '../Setup/DialogComponentSet'

export default {
  name: 'NavBar',
  components: {
    DialogInteracted,
    DialogComponentSet
  },
  computed: {
    ...mapState('app', ['copyComponentIds']),
    ...mapGetters('mode', ['isProductionMode', 'isPreviewMode', 'isDraftMode'])
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
    }
  }
}
</script>

<style scoped lang="scss">
nav {
  text-align: center;
  height: 35px;
  padding: 5px 20px;
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
.el-button {
  font-size: 16px;
  padding: 7px;
}
.preview {
  position: fixed;
  left: 35%;
  z-index: 10;
}
</style>
