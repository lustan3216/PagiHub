import { mapMutations } from 'vuex'
import { CHILDREN, GRID_ITEM, TAG } from '@/const'
import { cloneJson, traversal, arrayLast } from '@/utils/tool'
import { traversalChildrenOf, getNode } from '@/utils/node'
import { nodeIds } from '@/utils/nodeId'
import basicTemplates from '@/templateJson/basic'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  inject: {
    componentSetId: {
      // the value is null only happen on componentSet node
      // other cases should have string id
      default: null
    },
    rootComponentSetId: { default: null }
  },
  computed: {
    node() {
      return getNode(this.id)
    },
    children() {
      return (this.node && this.node.children) || []
    },
    innerChildren() {
      // 這裡沒必要排序，index 在各自component選擇性處理就可以
      // appendNestedIds(innerChildren)
      // children 因為每次更新 draftNodesMap，如果innerChildren用computed會所有的component都被更新
      return this.children.map(
        ({ [CHILDREN]: _, moved, parentId, ...node }) => ({
          ...node
        })
      )
    },
    parentNodes() {
      const path = []

      const findPath = id => {
        const node = getNode(id)

        if (node && node.parentId) {
          const parentNode = this.componentsMap[node.parentId]
          if (!parentNode) {
            return
          }
          path.unshift(parentNode)
          findPath(node.parentId)
        }
      }

      findPath(this.id)
      return path
    }
  },
  methods: {
    ...mapMutations('app', ['SET_SELECTED_COMPONENT_ID']),
    ...mapMutations('component', ['RECORD', 'SET_EDITING_COMPONENT_SET_ID']),

    _addNodesToParentAndRecord(nodeTree = {}) {
      // could be triggered by copy, delete
      this.SET_EDITING_COMPONENT_SET_ID(this.rootComponentSetId)
      const records = []

      nodeTree = cloneJson(nodeTree)
      // if node has not componentSetId means self is componentSet
      nodeIds.appendIdNested(nodeTree, this.componentSetId || this.id)
      nodeTree.parentId = this.id

      traversal(nodeTree, (_node, _parentNode) => {
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
      const template = basicTemplates.find(x => x[TAG] === tag)
      const emptyItem = arrayLast(template[CHILDREN])

      this._addNodesToParentAndRecord(emptyItem)
    },

    _copy(theNodeIdGonnaCopy) {
      // should use vmMap method to call to keep consistency
      const theNodeGonnaCopy = this.innerChildren.find(
        x => x.id === theNodeIdGonnaCopy
      )

      const children = this.children[theNodeIdGonnaCopy]
      theNodeGonnaCopy[CHILDREN] = children
      this._addNodesToParentAndRecord(theNodeGonnaCopy)
    },

    _remove(theNodeIdGonnaRemove) {
      // should use vmMap method to call to keep consistency
      let selectedId = null
      const records = [
        {
          path: theNodeIdGonnaRemove,
          value: undefined
        }
      ]

      traversalChildrenOf(theNodeIdGonnaRemove, child => {
        records.unshift({
          path: child.id,
          value: undefined
        })
      })

      for (let i = 0; i < this.parentNodes.length; i++) {
        const { id, tag } = this.parentNodes[this.parentNodes.length - 1 - i]

        if (tag === GRID_ITEM) {
          selectedId = id
          break
        }

        if (this.children.length === 1) {
          records.unshift({
            path: id,
            value: undefined
          })
        } else {
          selectedId = this.children[0].id
          break
        }
      }

      this.SET_SELECTED_COMPONENT_ID(selectedId)
      this.RECORD(records)
    }
  }
}
