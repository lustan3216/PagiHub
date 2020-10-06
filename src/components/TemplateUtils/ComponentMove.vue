<script>
import {
  closestGridItem,
  isGridItem,
  isOverlapComponent,
  sortByZIndex,
  traversalAncestorAndSelf
} from '@/utils/node'
import { arrayAscSort, arrayDescSort, arrayUniq, deleteBy, findIndexBy } from '@/utils/array'
import { appendIds } from '@/utils/nodeId'
import { CHILDREN, SORT_INDEX, STYLES } from '@/const'
import { mapMutations, mapGetters } from 'vuex'
import { gridGenerator } from '@/templateJson/basic'
import { vmGet } from '@/utils/vmMap'
import { getValueByPath } from '@/utils/tool'

const emptyGird = () =>
  gridGenerator({
    [CHILDREN]: []
  })

export default {
  name: 'ComponentMove',
  computed: {
    ...mapGetters('app', ['theOnlySelectedComponentId']),
    node() {
      const node = this.nodesMap[this.theOnlySelectedComponentId]

      if (isGridItem(node)) {
        return node
      }
      else {
        return closestGridItem(node)
      }
    },
    stack() {
      const vm = vmGet(this.node.id)
      return getValueByPath(vm, ['innerStyles', 'layout', 'stack'])
    },
    gridParent() {
      return this.node.parentNode
    },
    isFront() {
      return this.maxIndex === this.currentIndex
    },
    isEnd() {
      return this.minIndex === this.currentIndex
    },
    hasSibling() {
      return this.gridParent.children.length > 1
    },
    canMoveForward() {
      return this.node && this.hasSibling && !this.stack
    },
    canMoveBackward() {
      return this.node && this.hasSibling && !this.stack
    },
    zIndexMap() {
      return this.gridParent.children.reduce((map, node) => {
        const index = this.getZIndex(node)
        map[index] = map[index] || []
        map[index].push(node.id)
        return map
      }, {})
    },
    zIndexs() {
      return Object.keys(this.zIndexMap)
    },
    maxIndex() {
      return Math.max(...this.zIndexs)
    },
    minIndex() {
      return Math.min(...this.zIndexs)
    },
    currentIndex() {
      return this.getZIndex(this.node)
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    getZIndex(node) {
      const vm = vmGet(node.id)
      return getValueByPath(vm, ['innerStyles', 'layout', 'zIndex'], 0)
    },
    cleanGap() {
      const positive = arrayAscSort(this.zIndexs.filter(x => x >= 0))
      positive.forEach((zI, i) => {
        const ids = this.zIndexMap[zI]
        ids.forEach(id => {
          this.RECORD({
            path: [id, STYLES, 'layout', 'zIndex'],
            value: i || undefined
          })
        })
      })

      const negative = arrayDescSort(this.zIndexs.filter(x => x <= 0))
      negative.forEach((zI, i) => {
        const ids = this.zIndexMap[zI]
        ids.forEach(id => {
          this.RECORD({
            path: [id, STYLES, 'layout', 'zIndex'],
            value: -i || undefined
          })
        })
      })
    },
    record(value) {
      const child = this.node.children && this.node.children[0]
      if (child) {
        this.RECORD({
          path: [child.id, STYLES, 'layout', 'zIndex'],
          value
        })
      }
      else {
        this.RECORD({
          path: [this.node.id, STYLES, 'layout', 'zIndex'],
          value
        })
      }
    },
    moveForward() {
      if (this.canMoveForward) {
        this.cleanGap()
        this.record(this.currentIndex + 1)
      }
    },
    moveToFront() {
      if (this.canMoveForward) {
        this.cleanGap()
        this.record(this.maxIndex + 1)
      }
    },
    moveToBackward() {
      if (this.canMoveBackward) {
        this.cleanGap()
        this.record(this.currentIndex - 1)
      }
    },
    moveToEnd() {
      if (this.canMoveBackward) {
        this.cleanGap()
        this.record(this.minIndex - 1)
      }
    }
  },
  render() {
    return this.$scopedSlots.default({
      canMoveForward: this.canMoveForward,
      canMoveBackward: this.canMoveBackward,
      moveForward: this.moveForward,
      moveToFront: this.moveToFront,
      moveToBackward: this.moveToBackward,
      moveToEnd: this.moveToEnd
    })
  }
}
</script>

<style scoped lang="scss"></style>
