<template>
  <span class="flex">
    <el-button
      v-if="node.canNewItem"
      type="text"
      icon="el-icon-plus"
      @click.stop="() => vmCreateEmptyItem(node)"
    />

    <el-button
      v-if="!isLayers(node)"
      type="text"
      icon="el-icon-copy-document"
      @click.stop="() => vmPasteNode(node)"
    />

    <el-button
      type="text"
      icon="el-icon-delete"
      @click.stop="() => vmRemoveNode(node)"
    />

    <visible
      :id="id"
      visible
    />

    <touchable
      :id="id"
      visible
    />
  </span>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Touchable from './Touchable'
import Visible from './Visible'
import { GRID_ITEM } from '@/const'
import { isMac } from '@/utils/device'
import { isLayers } from '@/utils/node'

import {
  vmCreateEmptyItem,
  vmPasteNode,
  vmRemoveNode
} from '@/utils/vmMap'

export default {
  name: 'NodeController',
  components: {
    Visible,
    Touchable
  },
  props: {
    id: {
      type: String,
      required: true
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
    isGridItem() {
      return this.node.tag === GRID_ITEM
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
    isLayers,
    vmCreateEmptyItem,
    vmPasteNode,
    vmRemoveNode
  }
}
</script>
