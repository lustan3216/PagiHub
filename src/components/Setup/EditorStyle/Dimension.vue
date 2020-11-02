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
      <el-col :span="2">
        <span
          class="title flex"
          style="align-items: baseline"
        >
          X
        </span>
      </el-col>

      <el-col :span="12">
        <select-unit
          v-model="x"
          :min="0"
          :units="['px']"
        />
      </el-col>

      <el-col :span="2">
        <span
          class="title flex"
          style="align-items: baseline"
        >
          Y
        </span>
      </el-col>

      <el-col :span="12">
        <select-unit
          v-model="y"
          :min="0"
          :units="['px']"
        />
      </el-col>
    </el-row>

    <el-row
      :gutter="10"
      type="flex"
      align="middle"
    >
      <el-col :span="2">
        <span
          class="title flex"
          style="align-items: baseline"
        >
          W
        </span>
      </el-col>

      <el-col :span="10">
        <select-unit
          :disabled="!selectedComponentNodes.length"
          :number.sync="w"
          :unit.sync="unitW"
          :min="0"
          :units="['%', 'px', 'vw', 'vh']"
          separate
        />
      </el-col>

      <el-col :span="2">
        <span
          class="title flex"
          style="align-items: baseline"
        >
          H
        </span>
      </el-col>

      <el-col :span="10">
        <select-unit
          :disabled="heightDisabled"
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
import { isGroup, isTextEditor } from '@/utils/node'

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
    currentGrid() {
      if (this.lastNode) {
        const vm = vmGet(this.lastNode.id)
        return getValueByPath(vm, ['currentGrid'], {})
      }
      else {
        return {}
      }
    },
    cols() {
      return COLUMNS
    },
    heightDisabled() {
      const nodes = this.selectedComponentNodes.filter(
        node => isGroup(node) || isTextEditor(node)
      )
      return Boolean(nodes.length)
    },
    x: {
      get() {
        return this.currentGrid.x
      },
      set(value) {
        this.recordStore('x', value)
      }
    },
    y: {
      get() {
        return this.currentGrid.y
      },
      set(value) {
        this.recordStore('y', value)
      }
    },
    w: {
      get() {
        return this.currentGrid.w
      },
      set(value) {
        this.recordStore('w', value)
      }
    },
    h: {
      get() {
        return this.currentGrid.h
      },
      set(value) {
        this.recordStore('h', value)
      }
    },
    unitH: {
      get() {
        return this.currentGrid.unitH
      },
      set(value) {
        this.recordStore('unitH', value)
      }
    },
    unitW: {
      get() {
        return this.currentGrid.unitW
      },
      set(value) {
        this.recordStore('unitW', value)
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
    ...mapActions('node', ['record']),
    recordStore(key, value) {
      const records = []

      this.selectedComponentNodes.forEach(node => {
        records.push({
          path: [node.id, GRID, this.currentBreakpoint, key],
          value
        })
      })

      this.record(records)
    }
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
