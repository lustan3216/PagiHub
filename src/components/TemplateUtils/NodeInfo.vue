<template>
  <span
    v-if="node"
    :key="id"
  >
    <el-button
      v-shortkey="['q']"
      v-if="parentId && showFamily"
      class="p-5"
      @shortkey.native="selectedNode(parentId)"
      @click="selectedNode(parentId)"
    >
      {{ parentNodeShortName }} {{ parseInt(parentId) }}
    </el-button>

    <span
      v-if="parentId && showFamily"
      class="el-tree-node__label"
    > > </span>

    <el-button type="text"> {{ nodeShortName }} {{ parseInt(id) }} </el-button>

    <span
      v-if="firstChildNode && showFamily"
      class="el-tree-node__label"
    >
      >
    </span>

    <el-button
      v-shortkey="['w']"
      v-if="firstChildNode && showFamily"
      class="p-5"
      @shortkey.native="selectedNode(firstChildNode.id)"
      @click="selectedNode(firstChildNode.id)"
    >
      {{ firstChildNodeShortName }} {{ parseInt(firstChildNode.id) }}
    </el-button>
  </span>
</template>

<script>
import { mapMutations } from 'vuex'
import { CHILDREN, PARENT_ID, SOFT_DELETE } from '@/const'
import { shortTagName } from '@/utils/node'

export default {
  name: 'NodeInfo',
  props: {
    id: {
      type: String,
      required: true
    },
    showFamily: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    node() {
      return this.componentsMap[this.id]
    },
    nodeShortName() {
      return this.shortTagName(this.node)
    },
    firstChildNode() {
      const child = this.node[CHILDREN].find(node => !node[SOFT_DELETE])
      return child && this.componentsMap[child.id]
    },
    firstChildNodeShortName() {
      return this.shortTagName(this.firstChildNode)
    },
    parentId() {
      return this.node[PARENT_ID]
    },
    parentNode() {
      return this.componentsMap[this.parentId]
    },
    parentNodeShortName() {
      return this.shortTagName(this.parentNode)
    }
  },
  methods: {
    ...mapMutations('app', ['SET_SELECTED_COMPONENT_ID']),
    shortTagName,
    selectedNode(id) {
      this.SET_SELECTED_COMPONENT_ID(id)
    }
  }
}
</script>
