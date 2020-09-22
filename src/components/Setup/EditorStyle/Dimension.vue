<template>
  <div>
    <el-divider content-position="left">
      DIMENSION
    </el-divider>

    <el-row
      type="flex"
      align="middle"
    >
      <el-col :span="3">
        <el-checkbox
          :disabled="!canStickTop"
          v-model="verticalCompact"
        />
      </el-col>
      <el-col
        :span="10"
        class="title"
      >
        Sticky Top
      </el-col>
    </el-row>

    <fit-container />

    <fix-when-scrolling />

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
          :disabled="!gridItemNodes.length"
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
          :disabled="ratioDisabled"
          v-model.number="ratioW"
          :units="['W']"
        />
      </el-col>

      <el-col :span="12">
        <select-unit
          :disabled="ratioDisabled"
          v-model.number="ratioH"
          :units="['H']"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import Tip from '@/components/Tutorial/Tip'
import SelectUnit from '@/components/Components/SelectUnit'
import FitContainer from '@/components/Setup/EditorStyle/FitContainer'
import FixWhenScrolling from '@/components/Setup/EditorStyle/FixWhenScrolling'
import { COLUMNS, GRID, STYLES } from '@/const'
import { isGrid, isGridItem } from '@/utils/node'
import { arrayLast, arrayUniq } from '@/utils/array'
import { getValueByPath } from '@/utils/tool'
import { vmGet } from '@/utils/vmMap'

export default {
  name: 'Dimension',
  components: {
    SelectUnit,
    FitContainer,
    Tip,
    FixWhenScrolling
  },

  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapGetters('layout', ['currentBreakpoint']),
    selectedComponentNodes() {
      return this.selectedComponentIds
        .map(id => this.nodesMap[id])
        .filter(node => node && !isGrid(node))
    },
    canStickTop() {
      if (this.selectedComponentNodes.length) {
        return this.selectedComponentNodes.every(node => isGridItem(node))
      }
    },
    vms() {
      return this.selectedComponentNodes.map(node => vmGet(node.id))
    },
    cols() {
      return COLUMNS
    },
    fitContainer() {
      const result = this.vms.find(node => {
        return getValueByPath(node, `innerStyles.layout.fitContainer`)
      })

      return Boolean(result)
    },
    heightDisabled() {
      const result =
        !this.selectedComponentNodes.length ||
        Boolean(this.ratioH && this.ratioW) ||
        this.fitContainer
      return Boolean(result)
    },
    ratioDisabled() {
      // const hasInvalidComponent = this.selectedComponentNodes.find(node => 'video-player' === node.tag)
      return !this.selectedComponentNodes.length || this.fitContainer
    },
    gridItemNodes() {
      const nodes = []
      this.selectedComponentNodes.filter(node => {
        if (isGridItem(node)) {
          nodes.push(node)
        }
        else if (isGridItem(node.parentNode)) {
          nodes.push(node.parentNode)
        }
      })

      return nodes
    },
    gridItemVms() {
      return this.gridItemNodes.map(node => vmGet(node.id)).filter(x => x)
    },
    allVerticalCompact() {
      return this.vms.map(vm =>
        getValueByPath(vm, 'innerStyles.layout.verticalCompact')
      )
    },
    allW() {
      return this.gridItemVms.map(vm => {
        const prop = vm.innerGrid[this.currentBreakpoint]
        if (prop) {
          return (prop.w || '0').toString() + (prop.unitW || '%')
        }
      })
    },
    allH() {
      return this.gridItemVms.map(vm => {
        const prop = vm.innerGrid[this.currentBreakpoint]
        if (prop) {
          return (prop.h || '0').toString() + (prop.unitH || 'px')
        }
      })
    },
    verticalCompact: {
      get() {
        return arrayLast(this.allVerticalCompact)
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
        return arrayLast(this.allW)
      },
      set(value) {
        const records = []

        const unitW = value.toString().replace(/\d/g, '')
        value = parseInt(value)
        this.gridItemNodes.forEach(node => {
          records.push({
            path: `${node.id}.${GRID}.${this.currentBreakpoint}.unitW`,
            value: unitW === 'px' ? 'px' : undefined
          })
          records.push({
            path: `${node.id}.${GRID}.${this.currentBreakpoint}.w`,
            value: value || 0
          })
        })
        console.log(records, unitW)
        this.RECORD(records)
      }
    },
    h: {
      get() {
        return arrayLast(this.allH)
      },
      set(value) {
        const records = []

        const unitH = value.toString().replace(/\d/g, '')
        value = parseInt(value)
        this.gridItemNodes.forEach(node => {
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
    allRatioW() {
      return this.vms.map(vm => getValueByPath(vm, 'innerStyles.layout.ratioW'))
    },
    allRatioH() {
      return this.vms.map(vm => getValueByPath(vm, 'innerStyles.layout.ratioH'))
    },
    ratioW: {
      get() {
        const allSame = arrayUniq(this.allRatioW).length === 1
        if (allSame) {
          return this.allRatioW[0]
        }
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
        const allSame = arrayUniq(this.allRatioH).length === 1
        if (allSame) {
          return this.allRatioH[0]
        }
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
