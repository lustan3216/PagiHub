<template>
  <el-tooltip
    v-if="isPreviewMode"
    effect="light"
    content="Close Preview"
    placement="bottom"
  >
    <el-button
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'p']"
      icon="el-icon-close"
      circle
      class="close box-shadow"
      @click="SET_DRAFT_MODE"
      @shortkey.native="SET_DRAFT_MODE"
    />
  </el-tooltip>

  <nav v-else-if="isDraftMode" class="flex-center">
    <el-tooltip effect="light" content="Preview" placement="bottom">
      <el-button
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'p']"
        icon="el-icon-data-analysis"
        size="mini"
        type="text"
        @click="SET_PREVIEW_MODE"
        @shortkey.native="SET_PREVIEW_MODE"
      />
    </el-tooltip>

    <el-tooltip effect="light" content="Undo" placement="bottom">
      <el-button
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'z']"
        size="mini"
        type="text"
        icon="el-icon-refresh-left"
        @shortkey.native="UNDO"
        @click="UNDO"
      />
    </el-tooltip>

    <el-tooltip effect="light" content="Redo" placement="bottom">
      <el-button
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'z']"
        size="mini"
        type="text"
        icon="el-icon-refresh-right"
        @shortkey.native="REDO"
        @click="REDO"
      />
    </el-tooltip>

    <el-tooltip effect="light" content="Copy" placement="bottom">
      <el-button
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'c']"
        size="mini"
        type="text"
        icon="el-icon-document-copy"
        @shortkey.native="copy"
        @click="copy"
      />
    </el-tooltip>

    <portal-target name="view-port-controller" class="d-inline-block m-l-15" />

    <el-popover effect="light" trigger="hover" placement="bottom">
      <span>Are u sure to Publish？</span>
      <el-button
        type="info"
        size="mini"
        icon="el-icon-circle-check"
        circle
        @click="publish"
      />

      <el-button
        slot="reference"
        size="mini"
        type="text"
        icon="el-icon-upload"
      />
    </el-popover>
  </nav>
</template>

<script>
import { isMac } from '../../utils/device'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { Message } from 'element-ui'

export default {
  name: 'NavBar',
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
}
.el-button {
  font-size: 16px;
  padding: 7px;
}
.close {
  position: fixed;
  left: 15px;
  top: 15px;
  z-index: 300;
}
</style>
