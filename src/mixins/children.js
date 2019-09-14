import clone from 'clone'
import { mapMutations } from 'vuex'
import { appendNestedIds } from '../utils/keyId'

export default {
  props: {
    children: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    innerChildren(newChildren, oldChildren) {
      try {
        this.updateDifferenceToVuex(newChildren, oldChildren, this.id)
      } catch (e) {
        if (e !== 'done') throw e
        // 一次只會有一個地方刪除、新增或修改，所以當找到該node執行完就跳出遞迴迴圈
      }
    }
  },
  data() {
    const innerChildren = clone(this.children).sort((a, b) => a.sortIndex - b.sortIndex) // sorting

    innerChildren.forEach(child => {
      appendNestedIds(child)
    })

    return {
      innerChildren
    }
  },
  methods: {
    ...mapMutations('nodes', ['APPEND_NESTED_NODES', 'REMOVE_NESTED_NODES', 'UPDATE_NODES_SORT']),
    difference(arr1, arr2) {
      return arr1.filter(x => !arr2.includes(x))
    },
    updateDifferenceToVuex(newChildren = [], oldChildren = [], parentId) {
      // 這裡只處理新增node(包含拖移新的component或是copy) 、刪除node
      // 每個節點的數據更新都各自在component直接對vuex處理，節省效能
      const newLength = newChildren.length
      const oldLength = oldChildren.length
      const newIds = newChildren.map(x => x.id)
      const oldIds = oldChildren.map(x => x.id)

      if (newLength > oldLength) {
        const createdNodes = this.difference(newIds, oldIds).map(id => newChildren[newIds.indexOf(id)])
        this.APPEND_NESTED_NODES({
          nodes: createdNodes,
          parentId
        })
        this.UPDATE_NODES_SORT(newChildren)

        throw 'done'
      } else if (newLength < oldLength) {
        const deletedNodes = this.difference(oldIds, newIds).map(id => oldChildren[oldIds.indexOf(id)])
        this.REMOVE_NESTED_NODES(deletedNodes)

        throw 'done'
      } else {
        // 數量一樣，代表子結點有被拖移拉近新的component
        // 由於 vue-grid-layout 的item當拖移或變動大小，所有item都會變，所以就全部都update

        newChildren.some((newChild, index) => {
          this.APPEND_NODE(newChild) // 不用特地處理parentId，因為沒有增加節點
          this.updateDifferenceToVuex(newChild.children, oldChildren[index].children, newChild.id)
        })
      }
    }
  }
}
