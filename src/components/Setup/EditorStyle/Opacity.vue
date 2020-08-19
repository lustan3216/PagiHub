<template>
  <el-row
    type="flex"
    align="middle"
  >
    <el-col :span="8">
      <span class="title p-r-10">Opacity</span>
    </el-col>

    <el-col :span="16">
      <select-unit
        :units="[]"
        v-model="opacity"
        :min="0"
        :max="100"
        :step="1"
        prefix-icon="el-icon-sunset"
      />
    </el-col>
  </el-row>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import forNode from './mixins/forNode'
import { arrayLast } from '@/utils/tool'

export default {
  name: 'Opacity',
  mixins: [forNode('opacity')],
  components: {
    SelectUnit
  },
  computed: {
    opacity: {
      get() {
        const value = arrayLast(this.allValues)
        if (value === '') {
          return 100
        }
        else {
          return value * 100
        }
      },
      set(opacity) {
        this.recordStyles({ opacity: Number(opacity / 100).toString() })
      }
    }
  }
}
</script>
