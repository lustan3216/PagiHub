import { mapGetters, mapMutations } from 'vuex'
import { CHILDREN } from '../const'
import { cloneJson } from '../utils/tool'
import { draftIds } from '../utils/keyId'

export default {
  data() {
    const getterName = `${this.isExample ? 'example' : 'draft'}/childrenFrom`
    const childrenFrom = this.$store.getters[getterName]
    // TODO 要再確認有沒有需要排序 .sort((a, b) => a.sortIndex - b.sortIndex), 因為存的時候已經照順序存了
    // appendNestedIds(innerChildren)

    return {
      innerChildren: cloneJson(childrenFrom(this.id) || [])
    }
  },
  computed: {
    ...mapGetters('draft', ['examplesMapByTag']),
    firstChild() {
      return this.innerChildren[0]
    }
  },
  watch: {
    innerChildren(newChildren, oldChildren) {
      if (this.isExample) return
      this.updateDifferenceToVuex(newChildren, oldChildren, this.id)
    }
  },
  methods: {
    ...mapMutations('draft', ['RECORD']),
    difference(arr1, arr2) {
      return arr1.filter(x => !arr2.includes(x))
    },
    updateDifferenceToVuex(newChildren = [], oldChildren = []) {
      // 這裡只處理新增node(包含拖移新的component或是copy) 、刪除node
      // 每個節點的數據更新都各自在component直接對vuex處理，節省效能
      const newLength = newChildren.length
      const oldLength = oldChildren.length

      if (!newLength && !oldLength) return

      let records = []
      const newIds = newChildren.map(x => x.id)
      const oldIds = oldChildren.map(x => x.id)
      const difference = this.difference(newIds, oldIds).map(
        id => newChildren[newIds.indexOf(id)]
      )

      if (newLength > oldLength) {
        records = difference.map(node => ({
          path: node.id,
          value: { ...node, parentId: this.id }
        }))
      } else if (newLength < oldLength) {
        records = difference.map(node => ({ path: node.id, value: undefined }))
      } else {
        // 數量一樣，代表子結點有被拖移拉近新的component
        // 由於 vue-grid-layout 的item當拖移或變動大小，所有item都會變，所以就全部都update
        records = newChildren.map(node => ({
          path: node.id,
          value: { ...node, parentId: this.id }
        }))
      }

      this.RECORD(records)
    },

    new() {
      // template has a `canNew` setup to check can new or not
      // layers, grid-generator, carousel, form-generator
      // can new layer-item, grid-item, carousel-item, form-item
      const { tag } = this.node
      const itemFromExample = cloneJson(this.examplesMapByTag[tag][CHILDREN][0])
      const clonedInnerChildren = cloneJson(this.innerChildren)

      draftIds.resetNestedIds(itemFromExample)
      itemFromExample.parentId = this.id
      const { children, ..._itemFromExample } = itemFromExample
      clonedInnerChildren.push(_itemFromExample)

      // the above finish the current tier
      // beneath is gonna new grand children into vuex

      const records = []

      function newGrandChildrenRecords(nodes = []) {
        nodes.forEach(node => {
          records.push({
            path: node.id,
            value: node
          })

          newGrandChildrenRecords(node.children)
        })
      }

      newGrandChildrenRecords(children)
      this.RECORD(records)

      this.innerChildren = clonedInnerChildren
      // should be the last line, otherwise there no grand children can render when the new item ready
    },

    // https://vuejs.org/v2/api/#vm-watch ，這裡一定都要clone不然watch裡面新舊值會一樣
    copy(theNodeIdGonnaCopy) {
      // copy should considerate to the grandChildren tree,
      // however each node should only include own children and update by `updateDifferenceToVuex`
      // the rest of grand children should new into vuex, they will take care it own self since they have commonMixin
      const clonedInnerChildren = cloneJson(this.innerChildren)
      const theNodeIndexGonnaCopy = clonedInnerChildren.findIndex(
        x => x.id === theNodeIdGonnaCopy
      )

      const theNodeGonnaCopy = clonedInnerChildren[theNodeIndexGonnaCopy]

      draftIds.resetNestedIds(theNodeGonnaCopy)
      theNodeGonnaCopy.parentId = this.id

      clonedInnerChildren.splice(theNodeIndexGonnaCopy, 0, theNodeGonnaCopy)

      // the above finish the current tier
      // beneath is gonna new grand children into vuex

      const records = []

      function newGrandChildrenRecords(node) {
        this.childrenOf[node.id].forEach(child => {
          const cloneChild = cloneJson(child)
          draftIds.resetNestedIds(cloneChild)

          records.push({
            path: cloneChild.id,
            value: cloneChild
          })

          newGrandChildrenRecords(node)
        })
      }

      newGrandChildrenRecords(theNodeGonnaCopy)
      this.RECORD(records)

      // should be the last line, otherwise there no grand children can render when the copy component ready
      this.innerChildren = clonedInnerChildren
    },

    remove(theNodeIdGonnaRemove) {
      // remove only need to remove self and update by `updateDifferenceToVuex`
      // the grand children will destroy it self since their parentNode is gone
      // the rest need to do is updating grandChildren in vuex

      const clonedInnerChildren = cloneJson(this.innerChildren)
      const deleteIndex = clonedInnerChildren.findIndex(
        x => x.id === theNodeIdGonnaRemove
      )
      clonedInnerChildren.splice(deleteIndex, 1)
      this.innerChildren = clonedInnerChildren

      // the above finish the current tier
      // beneath is gonna delete grand children into vuex

      const records = []

      function newGrandChildrenRecords(nodeId) {
        this.childrenOf[nodeId].forEach(child => {
          records.push({
            path: child.id,
            value: undefined
          })

          newGrandChildrenRecords(child.id)
        })
      }

      newGrandChildrenRecords(theNodeIdGonnaRemove)
      this.RECORD(records)

      // CLEAN_SELECTED_COMPONENT_IDS
      const allDeletedIds = [this.id, ...records.map(x => x.path)]
      this.CLEAN_SELECTED_COMPONENT_IDS(allDeletedIds)
    }
  }
}
