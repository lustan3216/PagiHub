<template>
  <span>
    <el-button
      v-if="node.canNewItem"
      type="text"
      size="mini"
      icon="el-icon-plus"
      @click.stop="() => vmCreateItem(node)"
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
  </span>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Visibility from './Visible'
import Touchable from './Touchable'
import { vmCreateItem, vmCopyNode, vmRemoveNode } from '../../../utils/vmMap'

export default {
  name: 'NodeController',
  components: {
    Visibility,
    Touchable
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
    ...mapState('draft', ['nodesMap']),
    node() {
      return this.nodesMap[this.id]
    }
  },
  methods: {
    ...mapMutations('app', ['SET_SELECTED_COMPONENT_IDS']),
    vmCreateItem,
    vmCopyNode,
    vmRemoveNode
  }
}
</script>
