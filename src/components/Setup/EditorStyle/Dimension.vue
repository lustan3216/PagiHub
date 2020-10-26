<template>
  <div>
    <el-divider content-position="left">
      DIMENSION
      <tip class="m-l-5">
        Height will be disabled if Overflow is fit container.
      </tip>
    </el-divider>

    <el-row
      :gutter="10"
      type="flex"
      align="middle"
    >
      <el-col :span="3">
        <span
          class="title flex"
          style="align-items: baseline"
        >
          W
        </span>
      </el-col>

      <el-col :span="12">
        <select-unit
          :disabled="!selectedComponentNodes.length"
          :number.sync="w"
          :unit.sync="unitW"
          :max="unitWMax"
          :min="0"
          :units="['%', 'px', 'vw', 'vh']"
          separate
        />
      </el-col>

      <el-col :span="3">
        <span
          class="title flex"
          style="align-items: baseline"
        >
          H
        </span>
      </el-col>

      <el-col :span="12">
        <select-unit
          :disabled="heightDisabled"
          :max="unitHMax"
          :number.sync="h"
          :min="0"
          :unit.sync="unitH"
          :units="['px', 'vw', 'vh']"
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
import { COLUMNS, GRID } from '@/const'
import { arrayLast } from '@/utils/array'
import { getValueByPath } from '@/utils/tool'
import { vmGet } from '@/utils/vmMap'

export default {
  name: 'Dimension',
  components: {
    SelectUnit,
    Tip
  },

  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
    ...mapGetters('layout', ['currentBreakpoint']),
    unitWMax() {
      return this.unitW === 'px' ? Infinity : 100
    },
    unitHMax() {
      return this.unitH === 'px' ? Infinity : 100
    },
    lastNode() {
      return arrayLast(this.selectedComponentNodes)
    },
    currentGrid() {
      const vm = vmGet(this.lastNode.id)
      return getValueByPath(vm, ['currentGrid'], {})
    },
    cols() {
      return COLUMNS
    },
    heightDisabled() {
      return Boolean(this.ratioH && this.ratioW)
    },
    w: {
      get() {
        return this.currentGrid.w
      },
      set(value) {
        const records = []

        this.selectedComponentNodes.forEach(node => {
          records.push({
            path: [node.id, GRID, this.currentBreakpoint, 'w'],
            value
          })
        })

        this.record(records)
      }
    },
    h: {
      get() {
        return this.currentGrid.h
      },
      set(value) {
        const records = []

        this.selectedComponentNodes.forEach(node => {
          records.push({
            path: [node.id, GRID, this.currentBreakpoint, 'h'],
            value
          })
        })

        this.record(records)
      }
    },
    unitH: {
      get() {
        return this.currentGrid.unitH
      },
      set(value) {
        const records = []

        this.selectedComponentNodes.forEach(node => {
          records.push({
            path: [node.id, GRID, this.currentBreakpoint, 'unitH'],
            value
          })

          if (value !== 'px' && this.h > 100) {
            records.push({
              path: [node.id, GRID, this.currentBreakpoint, 'h'],
              value: 100
            })
          }
        })

        this.record(records)
      }
    },
    unitW: {
      get() {
        return this.currentGrid.unitW
      },
      set(value) {
        const records = []

        this.selectedComponentNodes.forEach(node => {
          records.push({
            path: [node.id, GRID, this.currentBreakpoint, 'unitW'],
            value
          })

          if (value !== 'px' && this.w > 100) {
            records.push({
              path: [node.id, GRID, this.currentBreakpoint, 'w'],
              value: 100
            })
          }
        })

        this.record(records)
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
    ...mapActions('node', ['record'])
  }
}
</script>

<style scoped lang="scss">
::v-deep.el-input {
  .el-input__inner {
    padding: 0 10px !important;
  }
}
</style>
