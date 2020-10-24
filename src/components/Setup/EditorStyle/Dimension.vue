<template>
  <div>
    <el-divider content-position="left">
      DIMENSION
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
          v-model="w"
          :max="cols"
          :units="['%']"
          delete-value=""
        />
      </el-col>

      <el-col :span="3">
        <span
          class="title flex"
          style="align-items: baseline"
        >
          H
          <tip class="m-l-5">
            Height will be disabled if Overflow is fit container.
          </tip>
        </span>
      </el-col>

      <el-col :span="12">
        <select-unit
          :disabled="heightDisabled"
          v-model="h"
          :units="['px', 'vh']"
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
    lastNode() {
      return arrayLast(this.selectedComponentNodes)
    },
    lastVm() {
      return vmGet(this.lastNode.id)
    },
    cols() {
      return COLUMNS
    },
    heightDisabled() {
      return Boolean(this.ratioH && this.ratioW)
    },
    w: {
      get() {
        const prop = this.lastVm && this.lastVm.currentGrid
        if (prop) {
          return (prop.w || '0').toString() + (prop.unitW || '%')
        }
      },
      set(value) {
        const records = []

        const unitW = value.toString().replace(/\d/g, '')
        value = parseInt(value)
        this.selectedComponentNodes.forEach(node => {
          records.push({
            path: [node.id, GRID, this.currentBreakpoint, 'unitW'],
            value: unitW === 'px' ? 'px' : undefined
          })
          records.push({
            path: [node.id, GRID, this.currentBreakpoint, 'w'],
            value: value || 0
          })
        })

        this.record(records)
      }
    },
    h: {
      get() {
        const prop = this.lastVm && this.lastVm.currentGrid
        if (prop) {
          return (prop.h || '0').toString() + (prop.unitH || 'px')
        }
      },
      set(value) {
        const records = []

        const unitH = value.toString().replace(/\d/g, '')
        value = parseInt(value)
        this.selectedComponentNodes.forEach(node => {
          records.push({
            path: [node.id, GRID, this.currentBreakpoint, 'unitH'],
            value: unitH === 'vh' ? 'vh' : undefined
          })
          records.push({
            path: [node.id, GRID, this.currentBreakpoint, 'h'],
            value: value || 0
          })
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
