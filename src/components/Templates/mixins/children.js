import { mapMutations, mapState } from 'vuex'
import { CHILDREN, STYLES, SORT_INDEX, PROPS, GRID, SOFT_DELETE } from '@/const'
import { arrayLast, isArray } from '@/utils/array'
import { vmRemoveNode } from '@/utils/vmMap'
import { cloneJson, deepMerge, getValueByPath, isUndefined } from '@/utils/tool'
import {
  isMasterHasAnyInstance,
  getMasterId,
  isInstanceParent,
  isMasterParent,
  isInstance,
  isInstanceChild
} from '@/utils/inheritance'
import { appendIds } from '@/utils/nodeId'
import {
  getNode,
  traversalSelfAndChildren,
  isLayers,
  isCarousel,
  isGridItem,
  cloneJsonWithoutChildren
} from '@/utils/node'
import * as basicTemplates from '@/templateJson/basic'
import { camelCase } from '@/utils/string'
import { arraySubtract } from '@/utils/array'
import { inheritanceObject } from '@/components/TemplateUtils/InheritanceController'

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
      default: inheritanceObject()
    }
  },
  computed: {
    ...mapState('node', ['rootComponentSetIds', 'editingComponentSetId']),
    node() {
      return getNode(this.id)
    },
    masterId() {
      return getMasterId(this.node)
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
    },
    masterChildren() {
      return getValueByPath(getNode(this.masterId), 'children', [])
    },
    sameComponentSet() {
      return this.node.rootComponentSetId === this.editingComponentSetId
    }
  },
  watch: {
    // 不要watch masterChildren的方式更新節點，不然redo undo會有bug
    'masterChildren.length'() {
      this.updateChildrenWithMaster()
    },
    masterId() {
      this.updateChildrenWithMaster()
    }
  },
  activated() {
    this.updateChildrenWithMaster()
  },
  methods: {
    ...mapMutations('app', [
      'SET_SELECTED_COMPONENT_ID',
      'CLEAN_SELECTED_COMPONENT_ID'
    ]),
    ...mapMutations('node', [
      'RECORD',
      'IRREVERSIBLE_RECORD',
      'SET_EDITING_COMPONENT_SET_ID'
    ]),

    updateChildrenWithMaster() {
      const diff = this.masterChildren.length - this.children.length
      if (
        this.isExample ||
        !this.inheritance.loaded ||
        !this.isDraftMode ||
        !this.masterId ||
        !this.sameComponentSet ||
        !diff
      ) {
        return
      }

      const records = []
      if (diff > 0) {
        arraySubtract(this.masterChildren, this.children).forEach(newItem => {
          records.push(...this.addNodeToParentRecords(newItem, true))
        })
      }
      else if (diff < 0) {
        arraySubtract(this.children, this.masterChildren).forEach(
          deleteItem => {
            records.push(...this.removeNodeRecords(deleteItem))
          }
        )
      }

      if (this.sameComponentSet) {
        this.RECORD(records)
      }
      else {
        this.IRREVERSIBLE_RECORD(records)
      }
    },

    addNodeToParentRecords(nodeTree = {}, isUnderInstanceParent) {
      // nodeTree should be single node instead of an array
      // could be triggered by copy, delete

      const records = []

      nodeTree = cloneJson(nodeTree)

      if (isGridItem(this.node)) {
        if (isGridItem(nodeTree)) {
          nodeTree.grid = this.node.grid
          vmRemoveNode(this.node)
        }
        else {
          // 加入的時候都把gridItem 的 style 放到nodeTree上，比較好管理style才不會兩邊放，直接merge兩邊style
          // 可解決的場景是，master都是最低的，但有可能gridItem 都無法編輯到所以master永遠被蓋過
          nodeTree[STYLES] = deepMerge(this.node[STYLES], nodeTree[STYLES])
          records.push({
            path: `${this.id}.${STYLES}`,
            value: undefined
          })
        }
      }

      appendIds(
        nodeTree,
        this.id,
        isInstanceParent(nodeTree) || isUnderInstanceParent,
        {
          instanceBeforeAppend: node => {
            const firstTimeInit = !getMasterId(node)
            if (firstTimeInit) {
              delete node[PROPS]
              delete node[STYLES]
              delete node[GRID]
            }
          }
        }
      )

      if (isLayers(this.node)) {
        nodeTree[SORT_INDEX] = this.children.length
      }

      traversalSelfAndChildren(nodeTree, node => {
        records.push({
          path: node.id,
          value: cloneJsonWithoutChildren(node)
        })
      })

      return records
    },

    addNodeToParent(nodeTree = {}) {
      if (this.isExample) {
        return
      }

      const records = this.addNodeToParentRecords(nodeTree)
      this.RECORD(records)
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

      if (SORT_INDEX in emptyItem) {
        // for layers, 新增加的item index 都比較高, 0是最底
        const indexArray = this.innerChildren.map(node => node[SORT_INDEX])
        const currentMaxIndex = Math.max(indexArray)
        emptyItem[SORT_INDEX] = currentMaxIndex + 1
      }

      this.addNodeToParent(emptyItem)
    },

    removeNodeRecords(theNodeGonnaRemove) {
      // should use vmMap method to call to keep consistency
      const records = []

      function traversal(node) {
        traversalSelfAndChildren(node, child => {
          if (isMasterParent(child) && isMasterHasAnyInstance(child)) {
            traversalSelfAndChildren(child, child => {
              if (isInstanceParent(child)) {
                traversal(child)
                return false
              }
              else {
                records.unshift({
                  path: `${child.id}.${SOFT_DELETE}`,
                  value: true
                })
              }
            })

            return false
          }

          records.unshift({
            path: child.id,
            value: undefined
          })
        })
      }

      traversal(theNodeGonnaRemove)

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

      return records
    },

    removeNodeFromParent(theNodeGonnaRemove) {
      if (this.isExample || isInstanceChild(theNodeGonnaRemove)) {
        return
      }

      const records = this.removeNodeRecords(theNodeGonnaRemove)

      const ids = records.map(x => x.path)
      this.CLEAN_SELECTED_COMPONENT_ID(ids)
      this.RECORD(records)
    }
  }
}
