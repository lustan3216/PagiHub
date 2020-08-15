<template>
  <div>
    <el-divider content-position="left">
      DIMENSION
    </el-divider>

    <auto-height />

    <el-row
      :gutter="10"
      type="flex"
      align="middle"
    >
      <el-col :span="5">
        <span
          class="title flex"
          style="align-items: baseline;"
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
            The grid system has <b class="crucial">{{ cols }}</b> columns
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

      <el-col :span="3">
        <span class="title">H</span>
      </el-col>

      <el-col :span="12">
        <select-unit
          :disabled="!gridItemNodes.length"
          v-model.number="h"
        />
      </el-col>
    </el-row>

    <ratio />
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import Tip from '@/components/Tutorial/Tip'
import SelectUnit from '@/components/Components/SelectUnit'
import { Divider } from 'element-ui'
import { COLUMNS } from '@/const'
import { isGridItem } from '@/utils/node'
import { arrayUniq } from '@/utils/tool'
import AutoHeight from './AutoHeight'
import Ratio from './Ratio'

export default {
  name: 'Dimension',
  components: {
    AutoHeight,
    SelectUnit,
    Tip,
    Ratio,
    ElDivider: Divider
  },
  computed: {
    cols() {
      return COLUMNS
    },
    ...mapState('app', ['breakpoint']),
    ...mapGetters('app', ['selectedComponentNodes']),
    gridItemNodes() {
      const nodes = []
      this.selectedComponentNodes.filter(node => {
        if (isGridItem(node)) {
          nodes.push(node)
        } else if (isGridItem(node.parentNode)) {
          nodes.push(node.parentNode)
        }
      })

      return nodes
    },
    allW() {
      return this.gridItemNodes.map(node => node.props[this.breakpoint].w)
    },
    allH() {
      return this.gridItemNodes.map(node => node.props[this.breakpoint].h)
    },
    w: {
      get() {
        const allSame = arrayUniq(this.allW).length === 1
        if (allSame) {
          return this.allW[0]
        }
      },
      set(value) {
        const records = []

        this.gridItemNodes.forEach(node => {
          records.push({
            path: `${node.id}.props.${this.breakpoint}.w`,
            value: value || 0
          })
        })

        if (records.length) {
          this.RECORD(records)
        }
      }
    },
    h: {
      get() {
        const allSame = arrayUniq(this.allH).length === 1
        if (allSame) {
          return this.allH[0]
        }
      },
      set(value) {
        const records = []

        this.gridItemNodes.forEach(node => {
          records.push({
            path: `${node.id}.props.${this.breakpoint}.h`,
            value: value || 0
          })
        })

        if (records.length) {
          this.RECORD(records)
        }
      }
    }
  },
  methods: {
    ...mapMutations('component', ['RECORD'])
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
