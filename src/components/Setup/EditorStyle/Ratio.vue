<template>
  <div>
    <el-divider content-position="left">
      RATIO
    </el-divider>

    <el-row
      :gutter="10"
      type="flex"
      align="middle"
    >
      <el-col :span="3">
        <span class="title flex">
          <tip class="m-l-5">
            Ratio will be disabled if height unit is
            <span class="crucial">vw</span>.
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
import { arrayLast } from '@/utils/array'
import { getValueByPath } from '@/utils/tool'

export default {
  name: 'Ratio',
  components: {
    SelectUnit,
    Tip
  },

  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
    lastNode() {
      return arrayLast(this.selectedComponentNodes)
    },
    lastNodeStyles() {
      return this.lastNode[STYLES]
    },
    ratioW: {
      get() {
        return getValueByPath(this.lastNodeStyles, 'layout.ratioW')
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
        return getValueByPath(this.lastNodeStyles, 'layout.ratioH')
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
