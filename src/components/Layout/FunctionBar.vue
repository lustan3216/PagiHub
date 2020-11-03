<template>
  <nav class="justify-between">
    <div class="flex">
      <function-menu style="margin-right: -5px;" />

      <el-tooltip
        effect="light"
        content="Preview"
        placement="bottom"
      >
        <el-button
          v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'p']"
          :disabled="!editingComponentSetId"
          type="text"
          @click="SET_PREVIEW_MODE"
          @shortkey.native="SET_PREVIEW_MODE"
        >
          <b-icon-caret-right />
        </el-button>
      </el-tooltip>

      <el-tooltip
        effect="light"
        content="Publish"
        placement="bottom"
      >
        <dialog-publish />
      </el-tooltip>
    </div>

    <el-form
      ref="form"
      :disabled="!editingComponentSetId"
      class="align-center"
    >
      <dialog-component-tabs />

      <element-add-bar />

      <el-divider direction="vertical" />

      <portal-target name="BreakpointController" />
    </el-form>

    <div class="align-center p-r-10">
      <portal-target name="ViewPortController" />
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import DialogComponentSet from '../Setup/DialogComponentSet'
import DialogPublish from '@/components/Setup/DialogPublish'
import ElementAddBar from '@/components/ComponentAdd/ElementAddBar'
import DialogComponentTabs from '@/components/ComponentAdd/DialogComponentTabs'
import { BIconCaretRight } from 'bootstrap-vue'
import FunctionMenu from './FunctionMenu'
import { isMac } from '@/utils/device'

export default {
  name: 'FunctionBar',
  components: {
    BIconCaretRight,
    FunctionMenu,
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
    isMac
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
