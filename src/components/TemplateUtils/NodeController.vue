<template>
  <span class="justify-between align-center">
    <node-info
      :id="id"
      class="m-r-10"
    />

    <span>
      <portal-target
        v-if="!exclude.includes('portal')"
        :name="`NodeController${id}`"
        slim
      />

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
        v-if="isGridItem && hasNotChild"
        :id="id"
        style="width: 14px;"
        @onAdd="vmAddNodesToParentAndRecord(id, $event)"
      />

      <visibility :id="id" />

      <touchable :id="id" />

      <el-button
        v-if="!exclude.includes('copy') && canCopy"
        type="text"
        icon="el-icon-copy-document"
        @click.stop="() => vmCopyNode(node)"
      />

      <el-button
        v-if="!exclude.includes('delete') && canDelete"
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
import { mapMutations, mapState, mapGetters } from 'vuex'
import Touchable from './Touchable'
import jsonHistory from '../../store/jsonHistory'
import ExampleAdd from './ExampleAdd'
import Visibility from './Visible'
import NodeInfo from './NodeInfo'
import { CAN_NOT_COPY, CAN_NOT_DELETE, GRID_ITEM } from '@/const'
import { isMac } from '@/utils/device'
import {
  vmCreateItem,
  vmCopyNode,
  vmRemoveNode,
  vmAddNodesToParentAndRecord,
  vmPasteCopyComponents
} from '@/utils/vmMap'

export default {
  name: 'NodeController',
  components: {
    Visibility,
    Touchable,
    ExampleAdd,
    NodeInfo
  },
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
    ...mapState('app', ['selectedComponentIds', 'copyComponentIds']),
    ...mapGetters('draft', ['childrenOf']),
    node() {
      return this.draftNodesMap[this.id]
    },
    canDelete() {
      return this.node[CAN_NOT_DELETE] !== true
    },
    canCopy() {
      return this.node[CAN_NOT_COPY] !== true
    },
    isGridItem() {
      return this.node.tag === GRID_ITEM
    },
    hasNotChild() {
      return !this.childrenOf[this.id].length
    },
    selected() {
      return this.selectedComponentIds.includes(this.id)
    },
    selectedNodes() {
      return this.selectedComponentIds.map(id => this.draftNodesMap[id])
    }
  },
  methods: {
    ...mapMutations('draft', ['RECORD']),
    ...mapMutations('app', ['TOGGLE_SELECTED_COMPONENT_IN_IDS']),
    isMac,
    vmCreateItem,
    vmCopyNode,
    vmRemoveNode,
    vmPasteCopyComponents,
    vmAddNodesToParentAndRecord,
    multiPaste() {
      jsonHistory.current.recordsMerge(() => {
        this.selectedNodes.forEach(node => this.vmPasteCopyComponents(node.id))
      })
    },
    multiDelete() {
      jsonHistory.current.recordsMerge(() => {
        this.selectedNodes.forEach(node => this.vmRemoveNode(node))
      })
    }
  }
}
</script>
