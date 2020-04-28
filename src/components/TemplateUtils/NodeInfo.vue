<template>
  <span
    v-if="id"
    :key="id"
  >
    <el-button
      v-shortkey="['q']"
      v-if="parentId && showFamily"
      class="p-5"
      @shortkey.native="selectedNode(parentId)"
      @click="selectedNode(parentId)"
    >
      {{ parentNodeShortName }} {{ parentId }}
    </el-button>

    <span
      v-if="parentId && showFamily"
      class="el-tree-node__label"
    > > </span>

    <el-button type="text"> {{ nodeShortName }} {{ id }} </el-button>

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
      {{ firstChildNodeShortName }} {{ firstChildNode.id }}
    </el-button>
  </span>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { PARENT_ID, SOFT_DELETE } from '@/const'
import { shortTagName } from '@/utils/node'
import store from '@/store'

export default {
  name: 'NodeInfo',
  props: {
    id: {
      type: Number,
      required: true
    },
    showFamily: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters('draft', ['childrenOf']),
    node() {
      return this.draftNodesMap[this.id]
    },
    nodeShortName() {
      return this.shortTagName(this.node)
    },
    firstChildNode() {
      const child = this.childrenOf[this.id][0]
      return child && !child[SOFT_DELETE] && this.draftNodesMap[child.id]
    },
    firstChildNodeShortName() {
      return this.shortTagName(this.firstChildNode)
    },
    parentId() {
      return this.node[PARENT_ID]
    },
    parentNode() {
      return this.draftNodesMap[this[PARENT_ID]]
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
