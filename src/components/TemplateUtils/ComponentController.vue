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
      @click.stop="() => vmAddNode(node)"
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

    <lock
      :id="id"
      visible
    />
  </span>
</template>

<script>
import { mapMutations } from 'vuex'
import Lock from './Lock'
import Visible from './Visible'
import { isMac } from '@/utils/device'
import { getValueByPath } from '@/utils/tool'
import { isGridItem, isLayers } from '@/utils/node'

import { vmCreateEmptyItem, vmAddNode, vmRemoveNode } from '@/utils/vmMap'
import { COMPONENT_SET } from '@/const'

export default {
  name: 'ComponentController',
  components: {
    Visible,
    Lock
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
      if (
        getValueByPath(parentNode, 'parentNode.tag') === COMPONENT_SET &&
        parentNode.children.length === 1
      ) {
        return true
      }
      else if (
        getValueByPath(parentNode, 'parentNode.parentNode.tag') ===
          COMPONENT_SET &&
        parentNode.children.length === 1
      ) {
        return true
      }
    },
    node() {
      return this.nodesMap[this.id]
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
    vmAddNode,
    vmRemoveNode
  }
}
</script>
