<template>
  <nav class="justify-between">
    <div class="flex">
      <function-menu style="margin-right: -5px;" />

      <el-tooltip
        effect="light"
        placement="bottom"
      >
        <div slot="content">
          Preview
          <i
            v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'p']"
            class="gray-font-2 m-l-10"
            @shortkey="preview"
            v-html="`${ctrlKeyIcon}&#8679;P`"
          />
        </div>

        <el-button
          :disabled="!editingComponentSetId"
          type="text"
          @click="preview"
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
      <element-add-bar />

      <el-divider direction="vertical" />

      <portal-target name="ViewPortController" />
    </el-form>

    <div class="align-center p-r-10">
      <el-button
        type="text"
        @click="$router.push({ name: 'Dashboard' })"
      >
        <span
          style="line-height: 19px;"
          class="gray-font-2 small-title"
        >Dashboard</span>
      </el-button>
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import DialogComponentSet from '../Setup/DialogComponentSet'
import DialogPublish from '@/components/Setup/DialogPublish'
import ElementAddBar from '@/components/ComponentAdd/ElementAddBar'
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
    ElementAddBar
  },
  computed: {
    ...mapState('app', ['copyComponentIds', 'selectedComponentIds']),
    ...mapState('node', ['editingComponentSetId']),
    ...mapGetters('app', [
      'selectedComponentNodes',
      'theOnlySelectedComponentId'
    ]),
    selected() {
      return this.selectedComponentIds.includes(this.id)
    },
    ctrlKeyIcon() {
      return isMac() ? '&#8984;' : '&#8963;'
    }
  },
  methods: {
    ...mapActions('app', ['setCopySelectedNodeId']),
    ...mapMutations('mode', ['SET_PREVIEW_MODE']),
    isMac,
    preview() {
      if (this.editingComponentSetId) {
        this.SET_PREVIEW_MODE()
      }
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
