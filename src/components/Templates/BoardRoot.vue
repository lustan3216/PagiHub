<template>
  <component :is="outer">
    <component
      v-for="node in innerNodeTree"
      :is="`board-${mode}`"
      :id="node.id"
      :parent-id="node.parentId"
      :children="node.children"
    />
  </component>
</template>

<script>
import store from '../../store'
import { mapState, mapMutations } from 'vuex'
import { appendNestedIds } from '../../utils/keyId'
import BoardCarousel from './BoardCarousel'
import BoardComponent from './BoardComponent'
import BoardWebsite from './BoardWebsite'
import BrowserWindow from '../BrowserWindow'

export default {
  name: 'BoardRoot',
  components: {
    BoardCarousel,
    BoardComponent,
    BoardWebsite,
    BrowserWindow
  },
  data() {
    const layout = {
      carousel: 'carousel',
      website: 'grid-generator',
      component: 'edit-area'
    }

    const { mode } = store.state.app
    const { nodesTree } = store.state.nodes
    let innerNodeTree = nodesTree

    if (!nodesTree.length || layout[mode] !== nodesTree[0].tag) {
      innerNodeTree = {}
      innerNodeTree.tag = layout[mode]
      innerNodeTree.parentId = 0
      innerNodeTree.children = []

      appendNestedIds(innerNodeTree)

      this.APPEND_NODE({
        node: innerNodeTree,
        parentId: 0
      })
      innerNodeTree = [innerNodeTree]
    }

    return {
      innerNodeTree,
      layout
    }
  },
  computed: {
    ...mapState('app', ['mode']),
    outer() {
      return this.mode === 'carousel' ? 'div' : 'browser-window'
    }
  },
  methods: {
    ...mapMutations('nodes', ['APPEND_NODE'])
  }
}
</script>
