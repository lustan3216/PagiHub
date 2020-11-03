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
        v-model="innerOpacity"
        :min="0"
        :max="100"
        :step="1"
        prefix-icon="el-icon-sunset"
        @clear="recordStyles({ opacity: undefined })"
      />
    </el-col>
  </el-row>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import forNode from './mixins/forNode'

export default {
  name: 'Opacity',
  mixins: [forNode('opacity')],
  components: {
    SelectUnit
  },
  computed: {
    innerOpacity: {
      get() {
        const value = this.opacity
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
