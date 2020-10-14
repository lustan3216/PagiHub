import { mapMutations, mapState } from 'vuex'
import { CHILDREN, STYLES, PROPS, GRID, SOFT_DELETE } from '@/const'
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
  isCarousel,
  isGridItem,
  cloneJsonWithoutChildren,
  isGrid
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
      const realChildren = this.node.children || []
      const diff = this.masterChildren.length - realChildren.length
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
        arraySubtract(this.masterChildren, realChildren).forEach(newItem => {
          const { records: newRecords } = this.addNodeToParentRecords(
            newItem,
            true
          )
          records.push(...newRecords)
        })
      }
      else if (diff < 0) {
        arraySubtract(realChildren, this.masterChildren).forEach(deleteItem => {
          records.push(...this.removeNodeRecords(deleteItem))
        })
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
      let parentId = this.id
      nodeTree = cloneJson(nodeTree)

      if (isGridItem(this.node) && isGridItem(nodeTree)) {
        parentId = this.node.parentId
        nodeTree.grid = this.node.grid
        vmRemoveNode(this.node)
      }

      appendIds(
        nodeTree,
        parentId,
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
