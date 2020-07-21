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
        class="shadow-button m-l-15"
        @click="SET_DRAFT_MODE"
        @shortkey.native="SET_DRAFT_MODE"
      />
    </el-tooltip>
  </dialog-interacted>

  <nav
    v-else-if="isDraftMode"
    class="flex"
  >
    <div class="icons m-l-10">
      <el-tooltip
        ref="1"
        effect="light"
        content="Components"
        placement="right"
      />
      <el-button
        v-popover:1
        v-shortkey="['c']"
        class="shadow-button"
        type="text"
        icon="el-icon-circle-plus-outline"
        @shortkey.native="panelIconClick('component-tabs')"
        @click="panelIconClick('component-tabs')"
      />

      <el-tooltip
        ref="11"
        effect="light"
        content="Components"
        placement="right"
      />
      <el-button
        v-popover:11
        v-shortkey="['p']"
        class="shadow-button"
        type="text"
        icon="el-icon-cherry"
        @shortkey.native="panelIconClick('panel-project')"
        @click="panelIconClick('panel-project')"
      />

      <el-tooltip
        ref="3"
        effect="light"
        content="Project"
        placement="right"
      />
      <el-button
        v-popover:3
        v-shortkey="['s']"
        class="shadow-button"
        type="text"
        @shortkey.native="panelIconClick('panel-nodes')"
        @click="panelIconClick('panel-nodes')"
      >
        <i
          class="el-icon-grape"
          style="transform: scale(-1);"
        />
      </el-button>

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
        class="shadow-button"
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
        class="shadow-button"
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
        :disabled="!selectedComponentIds.length"
        class="shadow-button"
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
          :disabled="!copyComponentIds.length"
          class="shadow-button"
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
          class="shadow-button"
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
        class="shadow-button"
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
          :disabled="!editingComponentSetId"
          class="shadow-button"
          type="info"
          icon="el-icon-circle-check"
          circle
          @click="publish"
        />
      </el-popover>

      <i class="dot" />

      <el-tooltip
        ref="8"
        effect="light"
        content="Preview"
        placement="right"
      />
      <el-button
        v-popover:8
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'p']"
        :disabled="!editingComponentSetId"
        class="shadow-button"
        icon="el-icon-data-analysis"
        type="text"
        @click="SET_PREVIEW_MODE"
        @shortkey.native="SET_PREVIEW_MODE"
      />

      <el-button
        :disabled="!editingComponentSetId"
        class="shadow-button"
        type="text"
        icon="el-icon-upload"
      />
    </div>

    <component
      :is="currentPanel"
      class="panel"
    />
  </nav>
</template>

<script>
import { isMac } from '@/utils/device'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { Message } from 'element-ui'
import DialogInteracted from '@/components/Components/DialogInteracted'
import DialogComponentSet from '../Setup/DialogComponentSet'
import PanelProject from '../Setup/PanelProject'
import ComponentTabs from '../TemplateUtils/ComponentTabs'
import PanelNodes from '@/components/Setup/PanelNodes'

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
    PanelProject,
    ComponentTabs,
    DialogInteracted,
    DialogComponentSet,
    PanelNodes
  },
  data() {
    return {
      projectVisible: true,
      componentsVisible: false,
      currentPanel: 'panel-project'
    }
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
  created() {
    this.$bus.$on('component-tabs-visible', () => {
      this.projectVisible = false
      this.componentsVisible = true
    })
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
    panelIconClick(name) {
      this.currentPanel = this.currentPanel === name ? null : name
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
  margin: 15px 5px 0;
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
  margin-top: 15px;
  margin-bottom: 3px;
}
</style>
