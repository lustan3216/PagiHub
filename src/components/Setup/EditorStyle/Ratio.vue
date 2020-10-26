<template>
  <div>
    <el-divider content-position="left">
      RATIO
      <tip class="m-l-5">
        Ratio will be disabled if height unit is
        <span class="crucial">vw</span>.
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
          v-model.number="ratioW"
          :units="[]"
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
          v-model.number="ratioH"
          :units="[]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Tip from '@/components/Tip/TipPopper'
import SelectUnit from '@/components/Components/SelectUnit'
import { STYLES } from '@/const'
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

        this.record(records)
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

        this.record(records)
      }
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
