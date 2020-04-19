<template>
  <span class="justify-between align-center">
    <span class="el-tree-node__label m-r-10">
      {{ node.tag | shortTagName }} {{ id }}
    </span>

    <span>
      <el-button
        v-if="node.canNewItem"
        type="text"
        icon="el-icon-plus"
        @click.stop="() => vmCreateItem(node)"
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

      <example-add
        v-if="isGridItem"
        :id="id"
        @onAdd="vmAddNodesToParentAndRecord(id, $event)"
      />

      <visibility :id="id" />

      <touchable :id="id" />

      <el-button
        v-if="!exclude.includes('copy')"
        type="text"
        icon="el-icon-copy-document"
        @click.stop="() => vmCopyNode(node)"
      />

      <el-button
        v-if="!exclude.includes('delete')"
        type="text"
        icon="el-icon-delete"
        @click.stop="() => vmRemoveNode(node)"
      />

      <i
        v-shortkey="{ del: ['del'], del: ['backspace'] }"
        v-if="selected && !exclude.includes('delete')"
        @shortkey="multiDelete"
      />
    </span>
  </span>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Touchable from './Touchable'
import jsonStorer from '../../store/jsonStorer'
import ExampleAdd from './ExampleAdd'
import Visibility from './Visible'
import { GRID_ITEM } from '@/const'
import { isMac } from '@/utils/device'
import {
  vmCreateItem,
  vmCopyNode,
  vmRemoveNode,
  vmAddNodesToParentAndRecord,
  vmPasteCopyComponents
} from '@/utils/vmMap'
import { shortTagName } from '@/utils/node'

export default {
  name: 'NodeController',
  components: {
    Visibility,
    Touchable,
    ExampleAdd
  },
  filters: { shortTagName },
  props: {
    id: {
      type: Number,
      required: true
    },
    exclude: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState('draft', ['nodesMap']),
    ...mapState('app', ['selectedComponentIds', 'copyComponentIds']),
    node() {
      return this.nodesMap[this.id]
    },
    isGridItem() {
      return this.node.tag === GRID_ITEM
    },
    selected() {
      return this.selectedComponentIds.includes(this.id)
    },
    selectedNodes() {
      return this.selectedComponentIds.map(id => this.nodesMap[id])
    }
  },
  methods: {
    ...mapMutations('draft', ['RECORD']),
    ...mapMutations('app', ['TOGGLE_SELECTED_COMPONENT_IDS']),
    isMac,
    vmCreateItem,
    vmCopyNode,
    vmRemoveNode,
    vmPasteCopyComponents,
    vmAddNodesToParentAndRecord,
    multiPaste() {
      jsonStorer.current.recordsMerge(() => {
        this.selectedNodes.forEach(node => this.vmPasteCopyComponents(node.id))
      })
    },
    multiDelete() {
      jsonStorer.current.recordsMerge(() => {
        this.selectedNodes.forEach(node => this.vmRemoveNode(node))
      })
    }
  }
}
</script>
