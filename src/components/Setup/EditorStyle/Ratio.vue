<template>
  <el-row
    :gutter="10"
    type="flex"
    align="middle"
  >
    <el-col :span="5">
      <span class="title flex">
        Ratio
        <tip class="m-l-5">
          No matter what column it is, we will make sure the ratio of width and height are
          match.
        </tip>
      </span>
    </el-col>

    <el-col :span="12">
      <select-unit
        :disabled="!gridItemNodes.length"
        v-model.number="w"
        :units="['W']"
      />
    </el-col>

    <el-col :span="12">
      <select-unit
        :disabled="!gridItemNodes.length"
        v-model.number="h"
        :units="['H']"
      />
    </el-col>
  </el-row>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import Tip from '@/components/Tutorial/Tip'
import SelectUnit from '@/components/Components/SelectUnit'
import { isGridItem } from '@/utils/node'
import { arrayUniq, getValueByPath } from '@/utils/tool'

export default {
  name: 'Ratio',
  components: {
    SelectUnit,
    Tip
  },
  computed: {
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
      return this.gridItemNodes.map(node =>
        getValueByPath(node, 'props.ratio.w')
      )
    },
    allH() {
      return this.gridItemNodes.map(node =>
        getValueByPath(node, 'props.ratio.h')
      )
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
            path: `${node.id}.props.ratio.w`,
            value: value || undefined
          })
        })

        this.RECORD(records)
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
            path: `${node.id}.props.ratio.h`,
            value: value || undefined
          })
        })

        this.RECORD(records)
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
