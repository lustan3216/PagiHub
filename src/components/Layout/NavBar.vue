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
    <div class="icons">
      <el-tooltip
        ref="1"
        effect="light"
        content="Components"
        placement="right"
      />
      <el-button
        v-popover:1
        v-shortkey="['c']"
        type="text"
        icon="el-icon-circle-plus-outline"
        @shortkey.native="componentsIconClick"
        @click="componentsIconClick"
      />

      <el-tooltip
        ref="3"
        effect="light"
        content="Project"
        placement="right"
      />
      <el-button
        v-popover:3
        v-shortkey="['x']"
        type="text"
        icon="el-icon-grape"
        style="transform: scale(-1);"
        @shortkey.native="projectIconClick"
        @click="projectIconClick"
      />

      <i class="dot" />

      <el-tooltip
        ref="4"
        effect="light"
        content="Undo"
        placement="right"
      />
      <el-button
        v-popover:4
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'z']"
        type="text"
        icon="el-icon-refresh-left"
        @shortkey.native="UNDO"
        @click="UNDO"
      />

      <el-tooltip
        ref="5"
        effect="light"
        content="Redo"
        placement="right"
      />
      <el-button
        v-popover:5
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'z']"
        type="text"
        icon="el-icon-refresh-right"
        @shortkey.native="REDO"
        @click="REDO"
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
        effect="light"
        content="Paste Component"
        placement="bottom"
      >
        <el-button
          v-shortkey="[isMac ? 'meta' : 'ctrl', 'v']"
          type="text"
          icon="el-icon-document-add"
          size="small"
          @click="multiPaste"
          @shortkey.native="multiPaste"
        />
      </el-tooltip>

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

      <i class="dot"/>

      <el-tooltip
        ref="8"
        effect="light"
        content="Preview"
        placement="right"
      />
      <el-button
        v-popover:8
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'p']"
        icon="el-icon-data-analysis"
        type="text"
        @click="SET_PREVIEW_MODE"
        @shortkey.native="SET_PREVIEW_MODE"
      />

      <el-button
        type="text"
        icon="el-icon-upload"
      />
    </div>

    <panel-project
      v-show="projectVisible"
      class="panel"
    />

    <component-tabs
      v-show="componentsVisible"
      class="panel"
    />
  </nav>
</template>

<script>
import { isMac } from '@/utils/device'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { Message } from 'element-ui'
import DialogInteracted from '@/components/Components/DialogInteracted'
import DialogComponentSet from '../Setup/DialogComponentSet'
import MySpace from './MySpace'
import PanelProject from '../Setup/PanelProject'
import ComponentTabs from '../TemplateUtils/ComponentTabs'
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
    PanelProject,
    ComponentTabs,
    DialogInteracted,
    DialogComponentSet
  },
  data() {
    return {
      projectVisible: false,
      componentsVisible: false
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds', 'copyComponentIds']),
    ...mapState('component', ['editingComponentSetId']),
    ...mapGetters('mode', ['isProductionMode', 'isPreviewMode', 'isDraftMode']),
    selected() {
      return this.selectedComponentIds.includes(this.id)
    },
    selectedNodes() {
      return this.selectedComponentIds.map(id => this.componentsMap[id])
    }
  },
  created() {
    this.$bus.$on('component-tabs-visible', () => {
      this.projectVisible = false
      this.componentsVisible = true
    })
  },
  methods: {
    ...mapMutations('app', ['SET_COPY_SELECTED_COMPONENT_IDS']),
    ...mapMutations('mode', ['SET_PREVIEW_MODE', 'SET_DRAFT_MODE']),
    ...mapMutations('component', ['REDO', 'UNDO']),
    isMac,
    publish() {},
    copy() {
      this.SET_COPY_SELECTED_COMPONENT_IDS()
      const length = this.copyComponentIds.length
      if (length) {
        Message.info(`Copy ${length} Components`)
      }
    },
    projectIconClick() {
      this.componentsVisible = false
      this.projectVisible = !this.projectVisible
    },
    componentsIconClick() {
      this.projectVisible = false
      this.componentsVisible = !this.componentsVisible
    },
    vmCreateItem,
    vmCopyNode,
    vmRemoveNode,
    vmPasteCopyComponents,
    vmAddNodesToParentAndRecord,
    multiPaste() {
      jsonHistory.recordsMerge(() => {
        this.copyComponentIds.forEach(id => this.vmCopyNode(this.componentsMap[id]))
      })
    },
    multiDelete() {
      jsonHistory.recordsMerge(() => {
        this.selectedNodes.forEach(node => this.vmRemoveNode(node))
      })
    }
  }
}
</script>

<style scoped lang="scss">
nav {
  text-align: center;
  background-color: #fff;
  z-index: 200;
  box-shadow: 0 0 15px 0 rgba(32, 48, 60, 0.11);
}

.el-button {
  font-size: 16px;
  padding: 7px;
  margin: 10px 5px 0;
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

.dot {
  width: 2px;
  height: 2px;
  background-color: #b1b1b1;
  border-radius: 50%;
  margin-top: 11px;
  margin-bottom: 3px;
}
</style>
