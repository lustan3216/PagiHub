import { mapMutations, mapState } from 'vuex'
import { CHILDREN, STYLE, SORT_INDEX, PROPS } from '@/const'
import { arrayLast } from '@/utils/array'
import { cloneJson, deepMerge } from '@/utils/tool'
import { canInherit, appendIdsInherited } from '@/utils/inheritance'
import { appendIds } from '@/utils/nodeId'
import {
  traversalChildren,
  getNode,
  traversalSelfAndChildren,
  isLayers,
  isCarousel,
  isGridItem
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
    isExample: { default: false },
    inheritance: {
      default: {
        inheritParentId: null,
        masterComponentSetId: null
      }
    }
  },
  computed: {
    ...mapState('node', ['rootComponentSetIds']),
    node() {
      return getNode(this.id)
    },
    children() {
      return (this.node && this.node.children) || []
    },
    childrenLengthChange() {
      return this.children.length
    },
    innerChildren() {
      // 這裡沒必要排序，index 在各自component選擇性處理就可以
      // appendNestedIds(innerChildren)
      // children 因為每次更新 draftcomponentsMap，如果innerChildren用computed會所有的component都被更新
      return this.children.map(({ [CHILDREN]: _, ...node }) => node)
    }
  },
  watch: {
    childrenLengthChange() {}
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

      if (isGridItem(this.node)) {
        // 加入的時候都把gridItem 的 style 放到nodeTree上，比較好管理style才不會兩邊放，直接merge兩邊style
        // 可解決的場景是，master都是最低的，但有可能gridItem 都無法編輯到所以master永遠被蓋過
        nodeTree[STYLE] = deepMerge(this.node[STYLE], nodeTree[STYLE])
        records.push({
          path: `${this.id}.${STYLE}`,
          value: undefined
        })
      }
      let isInherited = false

      if (canInherit(nodeTree)) {
        isInherited = true
        appendIdsInherited(nodeTree, this.id)
      }
      else if (isGridItem(nodeTree) && canInherit(nodeTree.children[0])) {
        // 當griditem 裡面的first children 自己複製自己的時候
        const { [CHILDREN]: _, ...gridItem } = nodeTree
        appendIds(gridItem, this.id)
        appendIdsInherited(nodeTree.children[0], gridItem.id)
        gridItem.children = [nodeTree.children[0]]
        nodeTree = gridItem
      }
      else {
        appendIds(nodeTree, this.id)
      }

      if (isLayers(this.node)) {
        nodeTree[SORT_INDEX] = this.children.length
      }

      traversalSelfAndChildren(nodeTree, (_node, _parentNode) => {
        let node
        if (isInherited) {
          // eslint-disable-next-line
          // 清空 instance上所有的設定，這樣才能知道拿的是master還是要覆蓋
          const { [CHILDREN]: _1, [STYLE]: _2, [PROPS]: _3, ...newNode } = _node
          node = newNode
        }
        else {
          // eslint-disable-next-line
          const { [CHILDREN]: _, ...newNode } = _node
          node = newNode
        }
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
