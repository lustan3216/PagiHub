<script>
import {
  closestGridItem,
  isGridItem,
} from '@/utils/node'
import { arrayAscSort, arrayDescSort } from '@/utils/array'
import { CHILDREN, STYLES } from '@/const'
import { mapActions, mapGetters } from 'vuex'
import { vmGet } from '@/utils/vmMap'
import { getValueByPath } from '@/utils/tool'

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
      return this.node && this.hasSibling
    },
    canMoveBackward() {
      return this.node && this.hasSibling
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
    ...mapActions('node', ['record']),
    getZIndex(node) {
      const vm = vmGet(node.id)
      return getValueByPath(vm, ['innerStyles', 'layout', 'zIndex'], 0)
    },
    cleanGap() {
      const positive = arrayAscSort(this.zIndexs.filter(x => x >= 0))
      positive.forEach((zI, i) => {
        const ids = this.zIndexMap[zI]
        ids.forEach(id => {
          this.record({
            path: [id, STYLES, 'layout', 'zIndex'],
            value: i || undefined
          })
        })
      })

      const negative = arrayDescSort(this.zIndexs.filter(x => x <= 0))
      negative.forEach((zI, i) => {
        const ids = this.zIndexMap[zI]
        ids.forEach(id => {
          this.record({
            path: [id, STYLES, 'layout', 'zIndex'],
            value: -i || undefined
          })
        })
      })
    },
    recordValue(value) {
      const griItem = closestGridItem(this.node)

      this.record({
        path: [griItem.id, STYLES, 'layout', 'zIndex'],
        value
      })
    },
    moveForward() {
      if (this.canMoveForward) {
        this.cleanGap()
        this.recordValue(this.currentIndex + 1)
      }
    },
    moveToFront() {
      if (this.canMoveForward) {
        this.cleanGap()
        this.recordValue(this.maxIndex + 1)
      }
    },
    moveToBackward() {
      if (this.canMoveBackward) {
        this.cleanGap()
        this.recordValue(this.currentIndex - 1)
      }
    },
    moveToEnd() {
      if (this.canMoveBackward) {
        this.cleanGap()
        this.recordValue(this.minIndex - 1)
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
