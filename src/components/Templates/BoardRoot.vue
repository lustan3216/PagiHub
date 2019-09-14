<template>
  <component
    :is="`board-${mode}`"
    :id="innerNodeTree.id"
    :parent-id="innerNodeTree.parentId"
    :children="innerNodeTree.children"
  />
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { appendNestedIds } from '../../utils/keyId'
import BoardCarousel from './BoardCarousel'
import BoardComponent from './BoardComponent'
import BoardWebsite from './BoardWebsite'

export default {
  name: 'BoardRoot',
  components: {
    BoardCarousel,
    BoardComponent,
    BoardWebsite
  },
  data() {
    let innerNodeTree

    if (this.hasRootNode) {
      innerNodeTree = this.nodesTree
    } else {
      const node = {
        tag: 'grid-generator',
        children: []
      }

      appendNestedIds(node)
      node.parentId = 0
      this.APPEND_NODE({ node, parentId: 0 })
      innerNodeTree = node
    }

    return {
      innerNodeTree
    }
  },
  computed: {
    ...mapState('app', ['mode']),
    ...mapState('nodes', ['nodesTree', 'currentNodesMap']),
    hasRootNode() {
      return this.nodesTree.id && this.nodesTree.children && this.nodesTree.children.length
    }
  },
  methods: {
    ...mapMutations('nodes', ['APPEND_NODE'])
  }
}
</script>
