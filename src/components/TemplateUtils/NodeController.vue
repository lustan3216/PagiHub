<template>
  <span
    class="justify-between align-center"
    @mouseenter="mouseIn = true"
    @mouseleave="mouseIn = false"
  >
    <node-info
      :id="id"
      class="m-r-10"
    />

    <transition-group
      name="fade"
      class="flex"
    >
      <span
        v-if="mouseIn"
        :key="1"
        class="flex m-r-10"
      >
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
            type="text"
            icon="el-icon-document-add"
            size="small"
            @click="vmPasteCopyComponents(id)"
          />
        </el-tooltip>

        <el-button
          type="text"
          icon="el-icon-copy-document"
          @click.stop="() => vmCopyNode(node)"
        />
        <el-button
          type="text"
          icon="el-icon-delete"
          @click.stop="() => vmRemoveNode(node)"
        />
      </span>

      <span :key="2">
        <visible
          :visible="mouseIn"
          :id="id"
        />

        <touchable
          :visible="mouseIn"
          :id="id"
        />
      </span>
    </transition-group>
  </span>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Touchable from './Touchable'
import Visible from './Visible'
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
    Visible,
    Touchable,
    NodeInfo
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      mouseIn: false
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds', 'copyComponentIds']),
    ...mapState('component', ['editingComponentSetId']),
    node() {
      return this.componentsMap[this.id]
    },
    children() {
      return this.node.children
    },
    canDelete() {
      return this.node[CAN_NOT_DELETE] !== true
    },
    canPaste() {
      return this.node[CAN_NOT_COPY] !== true
    },
    isGridItem() {
      return this.node.tag === GRID_ITEM
    },
    hasNotChild() {
      return !this.children.length
    },
    selected() {
      return this.selectedComponentIds.includes(this.id)
    },
    selectedNodes() {
      return this.selectedComponentIds.map(id => this.componentsMap[id])
    }
  },
  methods: {
    ...mapMutations('component', ['RECORD']),
    isMac,
    vmCreateItem,
    vmCopyNode,
    vmRemoveNode,
    vmPasteCopyComponents,
    vmAddNodesToParentAndRecord
  }
}
</script>
