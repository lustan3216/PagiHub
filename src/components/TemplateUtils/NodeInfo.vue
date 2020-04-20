<template>
  <span>
    <el-button
      v-if="parentId && showFamily"
      @click="selectdNode(parentId)"
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
      v-if="firstChildNode && showFamily"
      @click="selectdNode(firstChildNode)"
    >
      {{ firstChildNodeShortName }} {{ firstChildNode.id }}
    </el-button>
  </span>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { PARENT_ID } from '@/const'

const cache = {}

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
    ...mapState('draft', ['nodesMap']),
    ...mapGetters('draft', ['childrenOf']),
    node() {
      return this.nodesMap[this.id]
    },
    nodeShortName() {
      return this.shortTagName(this.node.tag)
    },
    firstChildNode() {
      const child = this.childrenOf[this.id][0]
      return child && this.nodesMap[child.id]
    },
    firstChildNodeShortName() {
      return this.shortTagName(this.firstChildNode.tag)
    },
    parentId() {
      return this.node[PARENT_ID]
    },
    parentNode() {
      return this.nodesMap[this[PARENT_ID]]
    },
    parentNodeShortName() {
      return this.shortTagName(this.parentNode.tag)
    }
  },
  methods: {
    ...mapMutations('app', ['SET_SELECTED_COMPONENT_ID']),
    selectdNode(id) {
      this.SET_SELECTED_COMPONENT_ID(id)
    },
    shortTagName(tag) {
      if (cache[tag]) {
        return cache[tag]
      }

      const splitTag = tag.split('-')
      if (splitTag[1] === 'generator') {
        cache[tag] = splitTag[0]
      } else if (splitTag[0] === 'form') {
        cache[tag] = splitTag[1]
      } else {
        cache[tag] = tag
      }
      cache[tag] = cache[tag].capitalize().replace('-', '')
      return cache[tag]
    }
  }
}
</script>
