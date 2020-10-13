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
      <el-col :span="4">
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
          :units="['%', 'px']"
          delete-value=""
        />
      </el-col>

      <el-col :span="4">
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

    <el-row
      :gutter="10"
      type="flex"
      align="middle"
    >
      <el-col :span="5">
        <span class="title flex">
          Ratio
          <tip class="m-l-5">
            Ratio will be disabled if height unit is
            <span class="crucial">vw</span> or Overflow is
            <span class="crucial">fit container</span>.
          </tip>
        </span>
      </el-col>

      <el-col :span="12">
        <select-unit
          v-model.number="ratioW"
          :units="['W']"
        />
      </el-col>

      <el-col :span="12">
        <select-unit
          v-model.number="ratioH"
          :units="['H']"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import Tip from '@/components/Tip/TipPopper'
import SelectUnit from '@/components/Components/SelectUnit'
import { COLUMNS, GRID, STYLES } from '@/const'
import { isGrid, isGridItem } from '@/utils/node'
import { arrayLast, arrayUniq } from '@/utils/array'
import { getValueByPath } from '@/utils/tool'
import { vmGet } from '@/utils/vmMap'
import { array } from "@/validator"

export default {
  name: 'Dimension',
  components: {
    SelectUnit,
    Tip
  },

  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapGetters('app', ['selectedComponentNodes']),
    ...mapGetters('layout', ['currentBreakpoint']),
    vms() {
      return this.selectedComponentNodes.map(node => vmGet(node.id))
    },
    cols() {
      return COLUMNS
    },
    lastVm() {
      return arrayLast(this.vms)
    },
    lastInnerStyles() {
      return getValueByPath(this.lastVm, 'innerStyles')
    },
    heightDisabled() {
      return Boolean(this.ratioH && this.ratioW)
    },
    verticalCompact: {
      get() {
        return getValueByPath(this.lastInnerStyles, 'layout.verticalCompact')
      },
      set(value) {
        const records = []

        this.selectedComponentNodes.forEach(node => {
          records.push({
            path: [node.id, STYLES, 'layout', 'verticalCompact'],
            value: value || undefined
          })
        })

        this.RECORD(records)
      }
    },
    w: {
      get() {
        const prop = this.lastVm.innerGrid[this.currentBreakpoint]
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
            path: `${node.id}.${GRID}.${this.currentBreakpoint}.unitW`,
            value: unitW === 'px' ? 'px' : undefined
          })
          records.push({
            path: `${node.id}.${GRID}.${this.currentBreakpoint}.w`,
            value: value || 0
          })
        })

        this.RECORD(records)
      }
    },
    h: {
      get() {
        const prop = this.lastVm.innerGrid[this.currentBreakpoint]
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
            path: `${node.id}.${GRID}.${this.currentBreakpoint}.unitH`,
            value: unitH === 'vh' ? 'vh' : undefined
          })
          records.push({
            path: `${node.id}.${GRID}.${this.currentBreakpoint}.h`,
            value: value || 0
          })
        })

        this.RECORD(records)
      }
    },
    ratioW: {
      get() {
        return getValueByPath(this.lastInnerStyles, 'layout.ratioW')
      },
      set(value) {
        const records = []

        this.selectedComponentNodes.forEach(node => {
          records.push({
            path: [node.id, STYLES, 'layout', 'ratioW'],
            value: value || undefined
          })
        })

        this.RECORD(records)
      }
    },
    ratioH: {
      get() {
        return getValueByPath(this.lastInnerStyles, 'layout.ratioH')
      },
      set(value) {
        const records = []

        this.selectedComponentNodes.forEach(node => {
          records.push({
            path: [node.id, STYLES, 'layout', 'ratioH'],
            value: value || undefined
          })
        })

        this.RECORD(records)
      }
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD'])
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
