import { mapMutations } from 'vuex'
import clone from 'clone'
import { appendIds } from '../utils/keyId'
import diff from '../utils/diff'

export default {
  props: {
    children: {
      type: Array,
      default() {
        return []
      }
    },
    id: {
      type: Number,
      required: true
    },
    parentId: {
      type: Number,
      required: true
    }
  },
  watch: {
    innerChildren(newChildren, oldChildren) {
      try {
        this.updateDifferenceToVuex(newChildren, oldChildren, this.id)
      } catch (e) {
        // 一次只會有一個地方刪除、新增或修改，所以當找到該node執行完就跳出遞迴迴圈
      }
    }
  },
  data() {
    const innerChildren = clone(this.children).sort((a, b) => a.sortIndex - b.sortIndex) // sorting

    innerChildren.forEach(child => {
      appendIds(child)
    })

    return {
      innerChildren
    }
  },
  methods: {
    ...mapMutations('nodes', ['APPEND_NODE', 'REMOVE_NODE', 'UPDATE_NODE_SORT']),
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
        const createdId = this.difference(newIds, oldIds)[0]
        const createdIndex = newIds.indexOf(createdId)
        const newNode = newChildren[createdIndex]

        this.appendNestedNode(newNode, parentId)

        newChildren.slice(createdIndex + 1, newLength).forEach((child, index) => {
          this.UPDATE_NODE_SORT({
            id: child.id,
            sortIndex: createdIndex + 1 + index
          })
        })

        throw 'done'
      } else if (newLength < oldLength) {
        const deletedId = this.difference(oldIds, newIds)[0]
        const deletedIndex = oldIds.indexOf(deletedId)
        const oldNode = oldChildren[deletedIndex]
        this.removeNestedNode(oldNode)

        throw 'done'
      } else {
        // 數量一樣，代表子結點有被拖移拉近新的component
        // 但由於 vue-grid-layout 不能識別是哪一個，所以只好迴圈處理

        newChildren.some((newChild, index) => {
          this.APPEND_NODE(newChild)
          this.updateDifferenceToVuex(newChild.children, oldChildren[index].children, newChild.id)
        })
      }
    },
    appendNestedNode(node, parentId) {
      node.parentId = parentId
      this.APPEND_NODE(node)

      node.children &&
        node.children.forEach(child => {
          this.appendNestedNode(child, node.id)
        })
    },
    removeNestedNode(node) {
      node.children &&
        node.children.forEach(child => {
          this.removeNestedNode(child)
        })

      this.REMOVE_NODE(node.id)
    }
  }
}
