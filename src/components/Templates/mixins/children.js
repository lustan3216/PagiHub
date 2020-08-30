import { mapMutations, mapState } from 'vuex'
import {
  CHILDREN,
  COMPONENT_SET,
  GRID_GENERATOR_ITEM,
  SORT_INDEX
} from '@/const'
import { arrayLast } from '@/utils/array'
import { cloneJson, getValueByPath } from '@/utils/tool'
import {
  traversalChildren,
  getNode,
  traversalAncestorAndSelf,
  traversalSelfAndChildren,
  isLayers,
  isGrid,
  isProject,
  isComponentSet,
  canBeInstance,
  isPage,
  isDesign,
  isCarousel
} from '@/utils/node'
import {
  appendIds,
  appendIdsWithConnection,
  appendIdsWithoutConnection
} from '@/utils/nodeId'
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
    ...mapState('node', ['rootComponentSetIds']),
    node() {
      return getNode(this.id)
    },
    children() {
      return (this.node && this.node.children) || []
    },
    innerChildren() {
      // 這裡沒必要排序，index 在各自component選擇性處理就可以
      // appendNestedIds(innerChildren)
      // children 因為每次更新 draftcomponentsMap，如果innerChildren用computed會所有的component都被更新
      return this.children.map(({ [CHILDREN]: _, ...node }) => node)
    }
  },
  methods: {
    ...mapMutations('app', [
      'SET_SELECTED_COMPONENT_ID',
      'CLEAN_SELECTED_COMPONENT_ID'
    ]),
    ...mapMutations('node', ['RECORD', 'SET_EDITING_COMPONENT_SET_ID']),

    _addNodesToParentAndRecord(nodeTree = {}) {
      // nodeTree should be single node instead of an array
      // could be triggered by copy, delete

      const records = []

      nodeTree = cloneJson(nodeTree)

      const { rootComponentSet } = this.componentsMap[nodeTree.id]
      if (isPage(this.node.rootComponentSet) && isDesign(rootComponentSet)) {
        nodeTree = {
          tag: 'connection-layer',
          rootMasterId: rootComponentSet.id,
          children: [nodeTree]
        }
        appendIdsWithConnection(nodeTree, this.id)
      }
      else if (
        isPage(this.node.rootComponentSet) &&
        isPage(rootComponentSet)
      ) {
        appendIds(nodeTree, this.id)
      }
      else {
        appendIdsWithoutConnection(nodeTree, this.id)
      }

      if (isLayers(this.node)) {
        nodeTree[SORT_INDEX] = this.children.length
      }

      traversalSelfAndChildren(nodeTree, (_node, _parentNode) => {
        // eslint-disable-next-line
        const { [CHILDREN]: _, ...node } = _node
        records.push({
          path: node.id,
          value: { ...node, parentId: node.parentId }
        })
      })

      this.RECORD(records)
    },

    _createEmptyItem() {
      // should use vmMap method to call to keep consistency

      // 這裏拿到的example有可能有deep children
      // template has a `canNew` setup to check can new or not
      // layers, grid-layout, carousel, form-generator
      // can new layer-item, grid-item, carousel-item, form-item
      const { tag } = this.node
      // eslint-disable-next-line
      const template = basicTemplates[camelCase(tag)]()
      const emptyItem = arrayLast(template[CHILDREN])

      if (SORT_INDEX in emptyItem) {
        // for layers, 新增加的item index 都比較高, 0是最底
        const indexArray = this.innerChildren.map(node => node[SORT_INDEX])
        const currentMaxIndex = Math.max(indexArray)
        emptyItem[SORT_INDEX] = currentMaxIndex + 1
      }

      this._addNodesToParentAndRecord(emptyItem)
    },

    _remove(theNodeGonnaRemove) {
      if (this.isExample) {
        return
      }
      // should use vmMap method to call to keep consistency
      const records = [
        {
          path: theNodeGonnaRemove.id,
          value: undefined
        }
      ]

      traversalChildren(theNodeGonnaRemove, child => {
        records.unshift({
          path: child.id,
          value: undefined
        })
      })

      if (this.children.length > 1 && isLayers(this.node)) {
        const children = this.children.filter(
          child => child.id !== theNodeGonnaRemove.id
        )
        children.forEach((child, index) => {
          records.unshift({
            path: `${child.id}.${SORT_INDEX}`,
            value: index
          })
        })
      }

      const stopNodeId = this.id

      if (isLayers(this.node) || isCarousel(this.node)) {
        if (this.node.children.length === 1) {
          records.unshift({
            path: this.node.id,
            value: undefined
          })
        }
      }

      // traversalAncestorAndSelf(
      //   this.node,
      //   ({ id, tag, children, parentNode }) => {
      //     stopNodeId = id
      //
      //     if (
      //       parentNode &&
      //       parentNode.parentNode &&
      //       isComponentSet(parentNode.parentNode) &&
      //       parentNode.children.length === 1
      //     ) {
      //       return 'stop'
      //     }
      //     else if (tag === GRID_GENERATOR_ITEM || children.length > 1) {
      //       return 'stop'
      //     }
      //     else if (children.length === 1) {
      //       records.unshift({
      //         path: id,
      //         value: undefined
      //       })
      //     }
      //   }
      // )

      const ids = records.map(x => x.path)
      this.CLEAN_SELECTED_COMPONENT_ID(ids)
      this.RECORD(records)
      return stopNodeId
    }
  }
}
