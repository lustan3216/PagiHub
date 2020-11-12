<script>
import { closestGridItem, isGridItem } from '@/utils/node'
import { arrayAscSort, arrayDescSort } from '@/utils/array'
import { STYLES } from '@/const'
import { mapActions, mapGetters } from 'vuex'
import { vmGet } from '@/utils/vmMap'
import { getValueByPath } from '@/utils/tool'

export default {
  name: 'ComponentMove',
  computed: {
    ...mapGetters('app', ['theOnlySelectedComponentId']),
    node() {
      return this.nodesMap[this.theOnlySelectedComponentId]
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
    canMove() {
      return this.node && this.gridParent && this.hasSibling
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
      return Object.keys(this.zIndexMap).map(x => parseInt(x))
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
    ...mapActions('node', ['debounceRecord']),
    getZIndex(node) {
      const vm = vmGet(node.id)
      const value = getValueByPath(vm, ['innerStyles', 'layout', 'zIndex'], 0)
      return parseInt(value)
    },
    cleanGap() {
      const positive = arrayAscSort(this.zIndexs.filter(x => x >= 0))
      positive.forEach((zI, i) => {
        const ids = this.zIndexMap[zI]
        ids.forEach(id => {
          this.debounceRecord({
            path: [id, STYLES, 'layout', 'zIndex'],
            value: i || undefined
          })
        })
      })

      const negative = arrayDescSort(this.zIndexs.filter(x => x <= 0))
      negative.forEach((zI, i) => {
        const ids = this.zIndexMap[zI]
        ids.forEach(id => {
          this.debounceRecord({
            path: [id, STYLES, 'layout', 'zIndex'],
            value: -i || undefined
          })
        })
      })
    },
    recordValue(value) {
      this.debounceRecord({
        path: [this.node.id, STYLES, 'layout', 'zIndex'],
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
      canMoveForward: this.canMove,
      canMoveBackward: this.canMove,
      moveForward: this.moveForward,
      moveToFront: this.moveToFront,
      moveToBackward: this.moveToBackward,
      moveToEnd: this.moveToEnd
    })
  }
}
</script>

<style scoped lang="scss"></style>
