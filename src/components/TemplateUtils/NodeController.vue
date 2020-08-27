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
import { mapMutations } from 'vuex'
import Touchable from './Touchable'
import Visible from './Visible'
import { GRID_GENERATOR_ITEM } from '@/const'
import { isMac } from '@/utils/device'
import { isLayers } from '@/utils/node'

import { vmCreateEmptyItem, vmPasteNode, vmRemoveNode } from '@/utils/vmMap'

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
    node() {
      return this.componentsMap[this.id]
    },
    children() {
      return this.node.children
    },
    isGridItem() {
      return this.node.tag === GRID_GENERATOR_ITEM
    },
    selected() {
      return this.selectedComponentIds.includes(this.id)
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    isMac,
    isLayers,
    vmCreateEmptyItem,
    vmPasteNode,
    vmRemoveNode
  }
}
</script>
