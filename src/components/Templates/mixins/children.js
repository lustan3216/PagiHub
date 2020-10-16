import { mapMutations, mapState } from 'vuex'
import { CHILDREN, SOFT_DELETE } from '@/const'
import { arrayLast } from '@/utils/array'
import { vmRemoveNode } from '@/utils/vmMap'
import { cloneJson } from '@/utils/tool'
import { appendIds } from '@/utils/nodeId'
import {
  getNode,
  traversalSelfAndChildren,
  isCarousel,
  isGridItem,
  cloneJsonWithoutChildren,
  isGrid
} from '@/utils/node'
import * as basicTemplates from '@/templateJson/basic'
import { camelCase } from '@/utils/string'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  inject: {
    isExample: { default: false }
  },
  computed: {
    ...mapState('node', ['rootComponentSetIds', 'editingComponentSetId']),
    node() {
      return getNode(this.id)
    },
    children() {
      const children = (this.node && this.node.children) || []
      return children.filter(node => !node[SOFT_DELETE])
    },
    innerChildren() {
      // 這裡沒必要排序，index 在各自component選擇性處理就可以
      // appendNestedIds(innerChildren)
      // children 因為每次更新 draft nodesMap，如果innerChildren用computed會所有的component都被更新
      return this.children.map(({ [CHILDREN]: _, ...node }) => node)
    }
  },
  methods: {
    ...mapMutations('app', [
      'SET_SELECTED_COMPONENT_ID',
      'CLEAN_SELECTED_COMPONENT_ID'
    ]),
    ...mapMutations('node', ['RECORD', 'SET_EDITING_COMPONENT_SET_ID']),

    addNodeToParentRecords(nodeTree = {}) {
      // nodeTree should be single node instead of an array
      // could be triggered by copy, delete

      const records = []
      let parentId = this.id
      nodeTree = cloneJson(nodeTree)

      if (isGridItem(this.node) && isGridItem(nodeTree)) {
        parentId = this.node.parentId
        nodeTree.grid = this.node.grid
        vmRemoveNode(this.node)
      }

      appendIds(nodeTree, parentId)

      traversalSelfAndChildren(nodeTree, node => {
        records.push({
          path: node.id,
          value: cloneJsonWithoutChildren(node)
        })
      })

      return { records, newNodeId: nodeTree.id }
    },

    addNodeToParent(nodeTree = {}) {
      if (this.isExample) {
        return
      }

      const { records, newNodeId } = this.addNodeToParentRecords(nodeTree)
      this.RECORD(records)

      this.$nextTick(() => {
        this.SET_SELECTED_COMPONENT_ID(newNodeId)
      })
    },

    createEmptyItem() {
      if (this.isExample) {
        return
      }
      // should use vmMap method to call to keep consistency

      // 這裏拿到的example有可能有deep children
      // template has a `canNew` setup to check can new or not
      // layers, grid-layout, carousel, form-generator
      // can new layer-item, grid-item, carousel-item, form-item
      const { tag } = this.node
      // eslint-disable-next-line
      const template = basicTemplates[camelCase(tag)]()
      const emptyItem = arrayLast(template[CHILDREN])

      this.addNodeToParent(emptyItem)
    },

    removeNodeRecords(theNodeGonnaRemove) {
      // should use vmMap method to call to keep consistency
      const records = []

      traversalSelfAndChildren(theNodeGonnaRemove, child => {
        records.unshift({
          path: child.id,
          value: undefined
        })
      })

      return records
    },

    removeNodeFromParent(theNodeGonnaRemove) {
      if (this.isExample) {
        return
      }

      const records = this.removeNodeRecords(theNodeGonnaRemove)

      const ids = records.map(x => x.path)
      this.CLEAN_SELECTED_COMPONENT_ID(ids)
      this.RECORD(records)

      this.$nextTick(() => {
        if (isCarousel(this.node) || isGrid(this.node)) {
          if (this.node.children.length === 0) {
            this.RECORD({
              path: this.node.id,
              value: undefined
            })
          }
        }
      })
    }
  }
}
