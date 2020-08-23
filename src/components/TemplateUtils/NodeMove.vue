<script>
import {
  isOverlapComponent,
  sortByIndex,
  traversalAncestorAndSelf
} from '@/utils/node'
import { deleteBy, findIndexBy } from '@/utils/tool'
import { appendIdNested } from '@/utils/nodeId'
import { CHILDREN, SORT_INDEX } from '@/const'
import { mapMutations } from 'vuex'
import { gridGenerator } from '@/templateJson/basic'

const emptyGird = () =>
  gridGenerator({
    [CHILDREN]: []
  })

export default {
  name: 'NodeMove',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    node() {
      return this.componentsMap[this.id]
    },
    gridParent() {
      return this.node.parentNode
    },
    canOverlapComponent() {
      let canOverlapComponent = null
      traversalAncestorAndSelf(this.node, parent => {
        if (isOverlapComponent(parent)) {
          canOverlapComponent = parent
          return 'stop'
        }
      })
      return canOverlapComponent
    },
    isGridFront() {
      const { children } = this.canOverlapComponent
      const index = findIndexBy(children, 'id', this.gridParent.id)
      return children.length - 1 === index
    },
    isGridEnd() {
      return (
        findIndexBy(
          this.canOverlapComponent.children,
          'id',
          this.gridParent.id
        ) === 0
      )
    },
    hasSibling() {
      return this.gridParent.children.length > 1
    },
    gridHasSibling() {
      return this.canOverlapComponent.children.length > 1
    },
    canNotMoveForward() {
      return (
        !this.canOverlapComponent ||
        (!this.hasSibling && !this.gridHasSibling) ||
        (!this.hasSibling && this.isGridFront)
      )
    },
    canMoveForward() {
      return !this.canNotMoveForward
    },
    canMoveBackward() {
      return !this.canNotMoveBackward
    },
    canNotMoveBackward() {
      return (
        !this.canOverlapComponent ||
        (!this.hasSibling && !this.gridHasSibling) ||
        (!this.hasSibling && this.isGridEnd)
      )
    },
    gridIds() {
      return sortByIndex(this.canOverlapComponent.children).map(node => node.id)
    },
    currentPosition() {
      return findIndexBy(this.gridIds, this.gridParent.id)
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
  },
  methods: {
    ...mapMutations('component', ['RECORD']),
    record(newGridPosition) {
      const newGrid = emptyGird()

      newGrid[SORT_INDEX] = newGridPosition
      appendIdNested(newGrid, this.canOverlapComponent.id)
      const ids = Array.from(this.gridIds)
      ids.splice(newGridPosition, 0, newGrid.id)

      const shouldDeleteCurrentGrid = this.gridParent.children.length === 1

      if (shouldDeleteCurrentGrid) {
        deleteBy(ids, this.gridParent.id)
      }

      const records = []
      ids.forEach((id, index) => {
        if (id === newGrid.id) {
          records.push({
            path: newGrid.id,
            value: newGrid
          })
        }
        else {
          records.push({
            path: `${id}.${SORT_INDEX}`,
            value: index
          })
        }
      })

      records.push({
        path: `${this.node.id}.parentId`,
        value: newGrid.id
      })

      if (shouldDeleteCurrentGrid) {
        records.push({
          path: this.gridParent.id,
          value: undefined
        })
      }

      this.RECORD(records)
    },
    moveForward() {
      if (this.canMoveForward) {
        this.record(
          this.isGridFront ? this.currentPosition + 1 : this.currentPosition + 2
        )
      }
    },
    moveToFront() {
      if (this.canMoveForward) {
        this.record(this.gridIds.length)
      }
    },
    moveToBackward() {
      if (this.canMoveBackward) {
        this.record(
          this.isGridEnd ? this.currentPosition - 2 : this.currentPosition - 1
        )
      }
    },
    moveToEnd() {
      if (this.canMoveBackward) {
        this.record(0)
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
