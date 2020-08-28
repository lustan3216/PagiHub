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
      v-if="!canNotDelete"
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
import { isMac } from '@/utils/device'
import { isComponentSet, isGridItem, isLayers, isProject } from '@/utils/node'

import { vmCreateEmptyItem, vmPasteNode, vmRemoveNode } from '@/utils/vmMap'

export default {
  name: 'ComponentController',
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
    canNotDelete() {
      const { parentNode } = this.node
      if (isProject(parentNode)) {
        return true
      }
      else if (
        isComponentSet(parentNode) &&
        parentNode.children.length === 1
      ) {
        return true
      }
    },
    node() {
      return this.componentsMap[this.id]
    },
    children() {
      return this.node.children
    },
    isGridItem() {
      return isGridItem(this.node)
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
