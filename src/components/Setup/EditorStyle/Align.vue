<template>
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
import { arrayUniq } from '@/utils/array'
import { GRID, STYLES } from '@/const'
import {
  isBackground,
  closestValidGrid,
  isSlider,
  traversalAncestor,
  isGroup
} from '@/utils/node'
import { vmGet } from '@/utils/vmMap'
import { verticalUnitConvert, horizontalUnitConvert } from '@/utils/layout'

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
    ...mapState('layout', ['windowWidth', 'backgroundHeight']),
    sameParent() {
      const ids = this.selectedComponentNodes.map(node => node.parentId)
      return arrayUniq(ids).length === 1
    },
    gridParent() {
      let node
      traversalAncestor(this.selectedComponentNodes[0], parent => {
        if (isSlider(parent) || isBackground(parent) || isGroup(parent)) {
          node = parent
          return false
        }
      })

      return node
    },
    parentHeight() {
      return verticalUnitConvert(
        this.gridParent.id,
        this.validParentGrid.h,
        this.validParentGrid.unitH,
        'px'
      )
    },
    parentWidth() {
      return horizontalUnitConvert(
        this.gridParent.id,
        this.validParentGrid.w,
        this.validParentGrid.unitW,
        'px'
      )
    },
    validParentGrid() {
      if (isBackground(this.gridParent)) {
        return {
          x: 0,
          y: 0,
          w: this.windowWidth,
          h: this.backgroundHeight,
          unitH: 'px',
          unitW: 'px',
          unitX: 'px',
          unitY: 'px'
        }
      }

      return closestValidGrid(this.gridParent, this.currentBreakpoint)
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
    ...mapActions('node', ['debounceRecord']),
    recordStore(id, key, value) {
      const vm = vmGet(id)

      if (key === 'x') {
        value = horizontalUnitConvert(id, value, 'px', vm.currentGrid.unitX)
      }
      else {
        value = verticalUnitConvert(id, value, 'px', vm.currentGrid.unitY)
      }

      this.debounceRecord([
        {
          path: [id, GRID, this.currentBreakpoint, key],
          value
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
          if (min > vm.pxY) min = vm.pxY
        })

        this.selectedComponentNodes.forEach(node => {
          this.recordStore(node.id, 'y', min)
        })
      }
    },
    alignMiddle() {
      if (this.isSingleNode) {
        const value =
          this.parentHeight / 2 - vmGet(this.theSingleNode.id).pxH / 2
        this.recordStore(this.theSingleNode.id, 'y', value)
      }
      else {
        let sum = 0
        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          sum += vm.pxY + vm.pxH / 2
        })

        const averageY = sum / this.selectedComponentNodes.length

        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          this.recordStore(node.id, 'y', averageY - vm.pxH / 2)
        })
      }
    },
    alignBottom() {
      if (this.isSingleNode) {
        const value = this.parentHeight - vmGet(this.theSingleNode.id).pxH
        this.recordStore(this.theSingleNode.id, 'y', value)
      }
      else {
        let max = 0
        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          if (max < vm.pxY + vm.pxH) max = vm.pxY + vm.pxH
        })

        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          this.recordStore(node.id, 'y', max - vm.pxH)
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
          if (min > vm.pxX) min = vm.pxX
        })

        this.selectedComponentNodes.forEach(node => {
          this.recordStore(node.id, 'x', min)
        })
      }
    },
    alignCenter() {
      if (this.isSingleNode) {
        const value =
          this.parentWidth / 2 - vmGet(this.theSingleNode.id).pxW / 2
        this.recordStore(this.theSingleNode.id, 'x', value)
      }
      else {
        let sum = 0
        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          sum += vm.pxX + vm.pxW / 2
        })

        const averageX = sum / this.selectedComponentNodes.length

        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          this.recordStore(node.id, 'x', averageX - vm.pxW / 2)
        })
      }
    },
    alignEnd() {
      if (this.isSingleNode) {
        const value = this.parentWidth - vmGet(this.theSingleNode.id).pxW
        this.recordStore(this.theSingleNode.id, 'x', value)
      }
      else {
        let max = 0
        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          if (max < vm.pxX + vm.pxW) max = vm.pxX + vm.pxW
        })

        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          this.recordStore(node.id, 'x', max - vm.pxW)
        })
      }
    },
    distributeHorizontal() {
      const sorted = this.selectedComponentNodes.sort((a, b) => {
        return vmGet(a.id).pxX - vmGet(b.id).pxX
      })

      let minX
      let maxX
      let sumW = 0
      sorted.forEach((node, index) => {
        const vm = vmGet(node.id)
        if (index === 0) {
          minX = vm.pxX
        }

        if (index === sorted.length - 1) {
          maxX = vm.pxX + vm.pxW
        }

        sumW += vm.pxW
      })

      const width = maxX - minX
      const averageGap = (width - sumW) / (sorted.length - 1)

      let acc = minX
      sorted.forEach((node, index) => {
        const vm = vmGet(node.id)

        if (index === 0) {
          acc += vm.pxW + averageGap
          return
        }

        if (index === sorted.length - 1) {
          return
        }

        this.recordStore(node.id, 'x', acc)
        acc += vm.pxW + averageGap
      })
    },
    distributeVertical() {
      const sorted = this.selectedComponentNodes.sort((a, b) => {
        return vmGet(a.id).pxY - vmGet(b.id).pxY
      })

      let minY
      let maxY
      let sumH = 0
      sorted.forEach((node, index) => {
        const vm = vmGet(node.id)
        if (index === 0) {
          minY = vm.pxY
        }

        if (index === sorted.length - 1) {
          maxY = vm.pxY + vm.pxH
        }

        sumH += vm.pxH
      })

      const width = maxY - minY
      const averageGap = (width - sumH) / (sorted.length - 1)

      let acc = minY
      sorted.forEach((node, index) => {
        const vm = vmGet(node.id)

        if (index === 0) {
          acc += vm.pxH + averageGap
          return
        }

        if (index === sorted.length - 1) {
          return
        }

        this.recordStore(node.id, 'y', acc)
        acc += vm.pxH + averageGap
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
