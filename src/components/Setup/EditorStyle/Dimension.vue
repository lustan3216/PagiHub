<template>
  <div
    class="relative"
    style="margin-top: 5px;"
  >
    <div class="flex-column lock-outer">
      <el-button
        :icon="`el-icon-${ratio ? 'lock' : 'unlock'}`"
        type="text"
        class="lock"
        @click="ratio = !ratio"
      />
    </div>

    <el-row
      :gutter="10"
      type="flex"
      align="middle"
    >
      <el-col :span="2">
        <span
          class="title flex"
          style="align-items: baseline"
        />
      </el-col>

      <el-col :span="2">
        <span
          class="title flex"
          style="align-items: baseline"
        >
          W
        </span>
      </el-col>

      <el-col :span="10">
        <select-unit
          :clearable="false"
          :disabled="!selectedComponentNodes.length || hasSlider"
          :number.sync="w"
          :unit.sync="unitW"
          :min="0"
          :step="unitW === 'px' ? 1 : 0.1"
          :units="['%', 'px', 'vw', 'vh']"
          separate
        />
      </el-col>

      <el-col :span="2">
        <span
          class="title flex"
          style="align-items: baseline"
        >
          X
        </span>
      </el-col>

      <el-col :span="10">
        <select-unit
          :clearable="false"
          :disabled="hasSlider || anyFixed"
          :number.sync="x"
          :min="0"
          :step="unitX === 'px' ? 1 : 0.1"
          :unit.sync="unitX"
          :units="['%', 'px', 'vw', 'vh']"
          separate
        />
      </el-col>
    </el-row>

    <el-row
      :gutter="10"
      type="flex"
      align="middle"
    >
      <el-col :span="2">
        <span
          class="title flex"
          style="align-items: baseline"
        />
      </el-col>

      <el-col :span="2">
        <span
          class="title flex"
          style="align-items: baseline"
        >
          H
        </span>
      </el-col>

      <el-col :span="10">
        <select-unit
          :clearable="false"
          :disabled="heightDisabled || hasSlider"
          :number.sync="h"
          :min="0"
          :step="unitH === 'px' ? 1 : 0.1"
          :unit.sync="unitH"
          :units="['%', 'px', 'vw', 'vh']"
          separate
        />
      </el-col>

      <el-col :span="2">
        <span
          class="title flex"
          style="align-items: baseline"
        >
          Y
        </span>
      </el-col>

      <el-col :span="10">
        <select-unit
          :clearable="false"
          :disabled="hasSlider || anyFixed"
          :number.sync="y"
          :min="0"
          :step="unitY === 'px' ? 1 : 0.1"
          :unit.sync="unitY"
          :units="['%', 'px', 'vw', 'vh']"
          separate
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Tip from '@/components/Tip/TipPopper'
import SelectUnit from '@/components/Components/SelectUnit'
import { GRID, STYLES } from '@/const'
import { arrayLast } from '@/utils/array'
import { getValueByPath } from '@/utils/tool'
import { vmGet } from '@/utils/vmMap'
import { isGroup, isSlider, isTextEditor } from '@/utils/node'
import { horizontalUnitConvert, verticalUnitConvert } from '@/utils/layout'

export default {
  name: 'Dimension',
  components: {
    SelectUnit,
    Tip
  },

  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
    ...mapGetters('layout', ['currentBreakpoint']),
    lastNode() {
      return arrayLast(this.selectedComponentNodes)
    },
    currentGrid() {
      if (this.lastNode) {
        const vm = vmGet(this.lastNode.id)
        return getValueByPath(vm, ['currentGrid'], {})
      }
      else {
        return {}
      }
    },
    anyFixed() {
      return !!this.selectedComponentNodes.find(node => getValueByPath(node, [STYLES, 'layout', 'position']) === 'fixed')
    },
    hasSlider() {
      return Boolean(
        this.selectedComponentNodes.filter(node => isSlider(node)).length
      )
    },
    heightDisabled() {
      const nodes = this.selectedComponentNodes.filter(
        node => isGroup(node) || isTextEditor(node)
      )
      return Boolean(nodes.length)
    },
    ratio: {
      get() {
        return getValueByPath(this.lastNode, [STYLES, 'layout', 'ratio'])
      },
      set(value) {
        const records = []

        this.selectedComponentNodes.forEach(node => {
          records.push({
            path: [node.id, STYLES, 'layout', 'ratio'],
            value: value || undefined
          })
        })

        this.debounceRecord(records)
      }
    },
    x: {
      get() {
        return this.currentGrid.x
      },
      set(value) {
        this.recordStore('x', value)
      }
    },
    y: {
      get() {
        return this.currentGrid.y
      },
      set(value) {
        this.recordStore('y', value)
      }
    },
    w: {
      get() {
        return this.currentGrid.w
      },
      set(value) {
        this.recordStore('w', value)
      }
    },
    h: {
      get() {
        return this.currentGrid.h
      },
      set(value) {
        this.recordStore('h', value)
      }
    },
    unitH: {
      get() {
        return this.currentGrid.unitH
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          this.debounceRecord({
            path: [node.id, GRID, this.currentBreakpoint, 'h'],
            value: verticalUnitConvert(node.id, vm.currentGrid.h, vm.currentGrid.unitH, value)
          })
        })

        this.recordStore('unitH', value)
      }
    },
    unitW: {
      get() {
        return this.currentGrid.unitW
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          this.debounceRecord({
            path: [node.id, GRID, this.currentBreakpoint, 'w'],
            value: horizontalUnitConvert(node.id, vm.currentGrid.w, vm.currentGrid.unitW, value)
          })
        })

        this.recordStore('unitW', value)
      }
    },
    unitX: {
      get() {
        return this.currentGrid.unitX
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)

          this.debounceRecord({
            path: [node.id, GRID, this.currentBreakpoint, 'x'],
            value: horizontalUnitConvert(node.id, vm.currentGrid.x, vm.currentGrid.unitX, value)
          })
        })

        this.recordStore('unitX', value)
      }
    },
    unitY: {
      get() {
        return this.currentGrid.unitY
      },
      set(value) {
        this.selectedComponentNodes.forEach(node => {
          const vm = vmGet(node.id)
          this.debounceRecord({
            path: [node.id, GRID, this.currentBreakpoint, 'y'],
            value: verticalUnitConvert(node.id, vm.currentGrid.y, vm.currentGrid.unitY, value)
          })
        })

        this.recordStore('unitY', value)
      }
    },
    ratioW() {
      return getValueByPath(this.lastNodeStyles, 'layout.ratioW')
    },
    ratioH() {
      return getValueByPath(this.lastNodeStyles, 'layout.ratioH')
    }
  },
  methods: {
    ...mapActions('node', ['debounceRecord']),
    recordStore(key, value) {
      const records = []

      this.selectedComponentNodes.forEach(node => {
        records.push({
          path: [node.id, GRID, this.currentBreakpoint, key],
          value
        })
      })

      this.debounceRecord(records)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.el-input {
  .el-input__inner {
    padding: 0 10px !important;
  }
}
.lock-outer {
  position: absolute;
  height: 40px;
  border: 1px solid #d6dae2;
  border-radius: 9px 0 0 9px;
  border-right: none;
  top: 12px;
  left: 4px;
  width: 10px;
  z-index: 10;
}
.lock {
  position: absolute;
  top: 9px;
  left: -12px;
  background: white !important;
  padding: 5px !important;
}
</style>
