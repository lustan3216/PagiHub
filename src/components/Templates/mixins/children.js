import { mapMutations, mapState } from 'vuex'
import { CHILDREN, COMPONENT_BODY, GRID_ITEM, SORT_INDEX, TAG } from '@/const'
import { cloneJson, arrayLast } from '@/utils/tool'
import {
  traversalChildren,
  getNode,
  traversalAncestorAndSelf,
  traversalSelfAndChildren
} from '@/utils/node'
import { appendIdNested } from '@/utils/nodeId'
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
    componentSetId: {
      // the value is null only happen on componentSet node
      // other cases should have string id
      default: null
    },
    isExample: { default: false },
    rootComponentSetId: { default: null }
  },
  computed: {
    ...mapState('component', ['rootComponentSetIds']),
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
      return this.children.map(({ [CHILDREN]: _, ...node }) => node)
    }
  },
  methods: {
    ...mapMutations('app', [
      'SET_SELECTED_COMPONENT_ID',
      'CLEAN_SELECTED_COMPONENT_ID'
    ]),
    ...mapMutations('component', ['RECORD', 'SET_EDITING_COMPONENT_SET_ID']),

    _addNodesToParentAndRecord(nodeTree = {}) {
      // nodeTree should be single node instead of an array
      // could be triggered by copy, delete

      const records = []

      nodeTree = cloneJson(nodeTree)
      // if node has not componentSetId means self is componentSet
      appendIdNested(nodeTree, this.id)

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

      let stopNodeId

      traversalAncestorAndSelf(
        this.node,
        ({ id, tag, children, parentNode }) => {
          stopNodeId = id
          if (
            parentNode.tag === COMPONENT_BODY &&
            parentNode.children.length === 1
          ) {
            return 'stop'
          }
          else if (tag === GRID_ITEM || children.length > 1) {
            return 'stop'
          }
          else if (children.length === 1) {
            records.unshift({
              path: id,
              value: undefined
            })
          }
        }
      )

      const ids = records.map(x => x.path)
      this.CLEAN_SELECTED_COMPONENT_ID(ids)
      this.RECORD(records)
      return stopNodeId
    }
  }
}
