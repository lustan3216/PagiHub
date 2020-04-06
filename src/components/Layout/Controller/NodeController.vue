<template>
  <span>
    <visibility :id="id" />

    <touchable :id="id" />

    <el-button
      v-if="node.canNew"
      type="text"
      size="mini"
      icon="el-icon-copy-document"
      @click.stop="() => vmNewNode(node)"
    />

    <el-button
      type="text"
      size="mini"
      icon="el-icon-copy-document"
      @click.stop="() => vmCopyNode(node)"
    />

    <el-button
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
import { vmNewNode, vmCopyNode, vmRemoveNode } from '../../../utils/vmMap'

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
    vmNewNode,
    vmCopyNode,
    vmRemoveNode
  }
}
</script>

<style scoped lang="scss"></style>
