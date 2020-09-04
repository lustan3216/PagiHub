<template>
  <div>
    <el-divider content-position="left">
      DIMENSION
    </el-divider>

    <el-row
      type="flex"
      align="middle"
    >
      <el-col
        :span="10"
        class="title"
      >
        Sticky Top
      </el-col>
      <el-col :span="7">
        <el-checkbox v-model="verticalCompact" />
      </el-col>
    </el-row>

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
          <tip class="m-l-5">
            Use column to build the Responsive Web Design layout is the most
            powerful implementation.
            <br >
            <br >
            After decided how many columns, we will calculate the width to fit
            any device automatically.
            <br >
            <br >
            The grid system has <span class="crucial">{{ cols }}</span> columns
            maximum on each device.
          </tip>
        </span>
      </el-col>

      <el-col :span="12">
        <select-unit
          :disabled="!gridItemNodes.length"
          v-model.number="w"
          :max="cols"
          :units="['col']"
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
import { Divider } from 'element-ui'
import { COLUMNS, GRID, STYLE } from '@/const'
import { isGrid, isGridItem } from '@/utils/node'
import { arrayLast, arrayUniq } from '@/utils/array'
import { getValueByPath } from '@/utils/tool'
import { vmGet } from '@/utils/vmMap'

export default {
  name: 'Dimension',
  components: {
    SelectUnit,
    Tip,
    ElDivider: Divider
  },

  computed: {
    ...mapState('app', ['breakpoint', 'selectedComponentIds']),
    selectedComponentNodes() {
      return this.selectedComponentIds
        .map(id => this.componentsMap[id])
        .filter(node => node && !isGrid(node))
    },
    vms() {
      return this.selectedComponentNodes.map(node => vmGet(node.id))
    },
    cols() {
      return COLUMNS
    },
    fitContainer() {
      const result = this.vms.find(node => {
        return (
          getValueByPath(node, 'innerStyles.default.overflow') ===
          'fitContainer'
        )
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
      return this.gridItemNodes.map(node => vmGet(node.id))
    },
    allVerticalCompact() {
      return this.vms.map(vm =>
        getValueByPath(vm, 'innerStyles.verticalCompact')
      )
    },
    allW() {
      return this.gridItemVms.map(vm => vm.innerGrid[this.breakpoint].w)
    },
    allH() {
      return this.gridItemVms.map(vm => {
        const prop = vm.innerGrid[this.breakpoint]
        return (prop.h || '').toString() + (prop.hUnit || 'px')
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
            path: `${node.id}.${STYLE}.verticalCompact`,
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

        this.gridItemNodes.forEach(node => {
          records.push({
            path: `${node.id}.${GRID}.${this.breakpoint}.w`,
            value: value || 0
          })
        })

        this.RECORD(records)
      }
    },
    h: {
      get() {
        return arrayLast(this.allH)
      },
      set(value) {
        const records = []

        const hUnit = value.toString().replace(/\d/g, '')
        value = parseInt(value)
        this.gridItemNodes.forEach(node => {
          records.push({
            path: `${node.id}.${GRID}.${this.breakpoint}.hUnit`,
            value: hUnit === 'vh' ? 'vh' : undefined
          })
          records.push({
            path: `${node.id}.${GRID}.${this.breakpoint}.h`,
            value: value || 0
          })
        })

        this.RECORD(records)
      }
    },
    allRatioW() {
      return this.vms.map(vm => getValueByPath(vm, 'innerStyles.ratioW'))
    },
    allRatioH() {
      return this.vms.map(vm => getValueByPath(vm, 'innerStyles.ratioH'))
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
            path: `${node.id}.${STYLE}.ratioW`,
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
            path: `${node.id}.${STYLE}.ratioH`,
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
