<template>
  <div>
    <el-divider content-position="left">ALIGN</el-divider>
    <el-form :disabled="!sameParent">
      <div class="flex">
        <el-button
          plain
          class="flex1"
          @click="alignTop"
        >
          <b-icon-align-top />
        </el-button>

        <el-button
          plain
          class="flex1"
          @click="alignMiddle"
        >
          <b-icon-align-middle />
        </el-button>

        <el-button
          plain
          class="flex1"
          @click="alignBottom"
        >
          <b-icon-align-bottom />
        </el-button>

        <el-button
          plain
          class="flex1"
          @click="alignStart"
        >
          <b-icon-align-start />
        </el-button>

        <el-button
          plain
          class="flex1"
          @click="alignCenter"
        >
          <b-icon-align-center />
        </el-button>
        <el-button
          plain
          class="flex1"
          @click="alignEnd"
        >
          <b-icon-align-end />
        </el-button>

        <el-button
          :disabled="!canDistribute"
          plain
          class="flex1"
          @click="distributeHorizontal"
        >
          <b-icon-distribute-horizontal />
        </el-button>

        <el-button
          :disabled="!canDistribute"
          plain
          class="flex1"
          @click="distributeVertical"
        >
          <b-icon-distribute-vertical />
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  BIconAlignBottom,
  BIconAlignCenter,
  BIconAlignEnd,
  BIconAlignMiddle,
  BIconAlignStart,
  BIconAlignTop,
  BIconDistributeHorizontal,
  BIconDistributeVertical
} from 'bootstrap-vue'
import { mapState, mapGetters, mapActions } from 'vuex'
import { arrayFirst, arrayUniq } from '@/utils/array'
import { GRID, STYLES } from '@/const'
import {
  isBackground,
  closestValidGrid,
  isSlider,
  traversalAncestor,
  isGroup
} from '@/utils/node'
import { vmGet } from '@/utils/vmMap'

export default {
  name: 'Align',
  components: {
    BIconAlignBottom,
    BIconAlignCenter,
    BIconAlignEnd,
    BIconAlignMiddle,
    BIconAlignStart,
    BIconAlignTop,
    BIconDistributeHorizontal,
    BIconDistributeVertical
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapGetters('app', ['selectedComponentNodes']),
    ...mapGetters('layout', ['currentBreakpoint']),
    ...mapState('layout', ['windowWidth', 'windowHeight']),
    sameParent() {
      const ids = this.selectedComponentNodes.map(node => node.parentId)
      return arrayUniq(ids).length === 1
    },
    validParentGrid() {
      let node
      traversalAncestor(this.selectedComponentNodes[0], parent => {
        if (isSlider(parent) || isBackground(parent) || isGroup(parent)) {
          node = parent
          return false
        }
      })

      if (isBackground(node)) {
        return {
          x: 0,
          y: 0,
          w: this.windowWidth,
          h: this.windowHeight
        }
      }

      return closestValidGrid(node, this.currentBreakpoint)
    },
    theSingleNode() {
      if (this.isSingleNode) return this.selectedComponentNodes[0]
    },
    isSingleNode() {
      return this.selectedComponentNodes.length === 1
    },
    canDistribute() {
      return this.sameParent && this.selectedComponentNodes.length > 2
    }
  },
  methods: {
    ...mapActions('node', ['record']),
    recordStore(id, key, value) {
      this.record([
        {
          path: [id, GRID, this.currentBreakpoint, key],
          value
        },
        {
          path: [id, STYLES, 'layout', 'stack'],
          value: undefined
        }
      ])
    },
    alignTop() {
      if (this.isSingleNode) {
        this.recordStore(this.theSingleNode.id, 'y', 0)
      }
      else {
        let min = Infinity
        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          if (min > vm.currentGrid.y) min = vm.currentGrid.y
        })

        this.selectedComponentNodes.forEach(node => {
          this.recordStore(node.id, 'y', min)
        })
      }
    },
    alignMiddle() {
      if (this.isSingleNode) {
        const vm = vmGet(this.theSingleNode.id)
        const value = this.validParentGrid.h / 2 - vm.currentGrid.h / 2
        this.recordStore(this.theSingleNode.id, 'y', value)
      }
      else {
        let sum = 0
        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          sum += vm.currentGrid.y + vm.currentGrid.h / 2
        })

        const averageY = sum / this.selectedComponentNodes.length

        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          this.recordStore(node.id, 'y', averageY - vm.currentGrid.h / 2)
        })
      }
    },
    alignBottom() {
      if (this.isSingleNode) {
        const vm = vmGet(this.theSingleNode.id)
        const value = this.validParentGrid.h - vm.currentGrid.h
        this.recordStore(this.theSingleNode.id, 'y', value)
      }
      else {
        let max = 0
        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          if (max > vm.currentGrid.y) max = vm.currentGrid.y
        })

        this.selectedComponentNodes.forEach(node => {
          this.recordStore(node.id, 'y', max)
        })
      }
    },
    alignStart() {
      if (this.isSingleNode) {
        this.recordStore(this.theSingleNode.id, 'x', 0)
      }
      else {
        let min = Infinity
        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          if (min > vm.currentGrid.x) min = vm.currentGrid.x
        })

        this.selectedComponentNodes.forEach(node => {
          this.recordStore(node.id, 'x', min)
        })
      }
    },
    alignCenter() {
      if (this.isSingleNode) {
        const vm = vmGet(this.theSingleNode.id)
        const value = this.validParentGrid.w / 2 - vm.currentGrid.w / 2
        this.recordStore(this.theSingleNode.id, 'x', value)
      }
      else {
        let sum = 0
        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          sum += vm.currentGrid.x + vm.currentGrid.w / 2
        })

        const averageX = sum / this.selectedComponentNodes.length

        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          this.recordStore(node.id, 'x', averageX - vm.currentGrid.w / 2)
        })
      }
    },
    currentGrid(node) {
      const vm = vmGet(node.id)
      return vm.currentGrid
    },
    alignEnd() {
      if (this.isSingleNode) {
        const value =
          this.validParentGrid.w - this.currentGrid(this.isSingleNode).w
        this.recordStore(this.theSingleNode.id, 'x', value)
      }
      else {
        let max = 0
        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          if (max < vm.currentGrid.x) max = vm.currentGrid.x
        })

        this.selectedComponentNodes.forEach(node => {
          this.recordStore(node.id, 'x', max)
        })
      }
    },
    distributeHorizontal() {
      const sorted = this.selectedComponentNodes.sort((a, b) => {
        return vmGet(a.id).currentGrid.x - vmGet(b.id).currentGrid.x
      })

      let minX
      let maxX
      let sumW = 0
      sorted.forEach((node, index) => {
        const grid = this.currentGrid(node)
        if (index === 0) {
          minX = grid.x
        }

        if (index === sorted.length - 1) {
          maxX = grid.x + grid.w
        }

        sumW += grid.w
      })

      const width = maxX - minX
      const averageGap = (width - sumW) / (sorted.length - 1)

      let acc = minX
      sorted.forEach((node, index) => {
        const grid = this.currentGrid(node)

        if (index === 0) {
          acc += grid.w + averageGap
          return
        }

        if (index === sorted.length - 1) {
          return
        }

        this.recordStore(node.id, 'x', acc)
        acc += grid.w + averageGap
      })
    },
    distributeVertical() {
      const sorted = this.selectedComponentNodes.sort((a, b) => {
        return vmGet(a.id).currentGrid.y - vmGet(b.id).currentGrid.y
      })

      let minY
      let maxY
      let sumH = 0
      sorted.forEach((node, index) => {
        const grid = this.currentGrid(node)
        if (index === 0) {
          minY = grid.y
        }

        if (index === sorted.length - 1) {
          maxY = grid.y + grid.h
        }

        sumH += grid.h
      })

      const width = maxY - minY
      const averageGap = (width - sumH) / (sorted.length - 1)

      let acc = minY
      sorted.forEach((node, index) => {
        const grid = this.currentGrid(node)

        if (index === 0) {
          acc += grid.h + averageGap
          return
        }

        if (index === sorted.length - 1) {
          return
        }

        this.recordStore(node.id, 'y', acc)
        acc += grid.h + averageGap
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.el-button {
  border-color: transparent;
  border-radius: 3px;
  margin-left: 0;

  &.is-disabled.is-plain,
  &.is-disabled.is-plain:focus,
  &.is-disabled.is-plain:hover {
    border-color: transparent;
  }
}
</style>
