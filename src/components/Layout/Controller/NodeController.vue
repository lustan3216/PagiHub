<template>
  <span class="justify-between align-center">
    <span class="el-tree-node__label m-r-10">
      {{ node.tag | shortTagName }} {{ id }}
    </span>

    <span>
      <el-button
        v-if="node.canNewItem"
        type="text"
        size="mini"
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
          @click="paste"
          @shortkey.native="paste"
        />
      </el-tooltip>

      <example-add
        v-if="isGridItem"
        :id="id"
        @onAdd="appendNodesToParentAndRecord($event)"
      />

      <visibility :id="id" />

      <touchable :id="id" />

      <el-button
        v-if="!exclude.includes('copy')"
        type="text"
        size="mini"
        icon="el-icon-copy-document"
        @click.stop="() => vmCopyNode(node)"
      />

      <el-button
        v-if="!exclude.includes('delete')"
        type="text"
        icon="el-icon-delete"
        size="mini"
        @click.stop="() => vmRemoveNode(node)"
      />

      <i
        v-shortkey="{ del: ['del'], del: ['backspace'] }"
        v-if="selected && !exclude.includes('delete')"
        @shortkey="() => vmRemoveNode(node)"
      />
    </span>
  </span>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Touchable from './Touchable'
import ExampleAdd from './ExampleAdd'
import Visibility from './Visible'
import childrenMixin from '../../../mixins/children'
import { GRID_ITEM, TAG } from '../../../const'
import { vmCreateItem, vmCopyNode, vmRemoveNode } from '../../../utils/vmMap'
import { isMac } from '../../../utils/device'
import { findFirstCommonParentTree, shortTagName } from '../../../utils/node'

export default {
  name: 'NodeController',
  components: {
    Visibility,
    Touchable,
    ExampleAdd
  },
  filters: { shortTagName },
  mixins: [childrenMixin],
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
    onlyOneCopyComponentId() {
      return this.copyComponentIds.length === 1 && this.copyComponentIds[0]
    },
    onlyOneCopyComponentNode() {
      if (this.onlyOneCopyComponentId) {
        return this.nodesMap[this.onlyOneCopyComponentId]
      }
    }
  },
  methods: {
    ...mapMutations('app', ['TOGGLE_SELECTED_COMPONENT_ID']),
    isMac,
    vmCreateItem,
    vmCopyNode,
    vmRemoveNode,
    paste() {
      if (this.onlyOneCopyComponentId === this.id) {
        vmCopyNode(this.onlyOneCopyComponentNode)
      } else if (this.isGridItem) {
        if (
          this.onlyOneCopyComponentNode &&
          this.onlyOneCopyComponentNode[TAG] !== GRID_ITEM
        ) {
          this.appendNodesToParentAndRecord(this.onlyOneCopyComponentNode)
        } else if (this.copyComponentIds.length > 1) {
          const tree = findFirstCommonParentTree(this.copyComponentIds)
          this.appendNodesToParentAndRecord(tree)
        }
      }
    }
  }
}
</script>
