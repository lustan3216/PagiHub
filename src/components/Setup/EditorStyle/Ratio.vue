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
          No matter what column it is, we will make sure the ratio of width and
          height are match.
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
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import Tip from '@/components/Tutorial/Tip'
import SelectUnit from '@/components/Components/SelectUnit'
import { isGridItem } from '@/utils/node'
import { arrayUniq } from '@/utils/array'
import { getValueByPath } from '@/utils/tool'

export default {
  name: 'Ratio',
  components: {
    SelectUnit,
    Tip
  },
  computed: {
    ...mapState('app', ['breakpoint']),
    ...mapGetters('app', ['selectedComponentNodes']),
    ratioDisabled() {
      // const hasInvalidComponent = this.selectedComponentNodes.find(node => 'video-player' === node.tag)

      return !this.gridItemNodes.length
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
    allRatioW() {
      return this.gridItemNodes.map(node =>
        getValueByPath(node, 'props.ratioW')
      )
    },
    allRatioH() {
      return this.gridItemNodes.map(node =>
        getValueByPath(node, 'props.ratioH')
      )
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

        this.gridItemNodes.forEach(node => {
          records.push({
            path: `${node.id}.props.ratioW`,
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

        this.gridItemNodes.forEach(node => {
          records.push({
            path: `${node.id}.props.ratioH`,
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
