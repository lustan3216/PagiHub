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
        v-model="innerValue"
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
export default {
  name: 'Opacity',
  components: {
    SelectUnit
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      innerValue: this.value * 100
    }
  },
  watch: {
    innerValue(opacity) {
      // Number() here to make share 1.00 => 1
      this.$emit('change', { opacity: Number(opacity / 100).toString()  })
    },
    value() {
      const { data } = this.$options
      return Object.assign(this, data.call(this))
    }
  }
}
</script>
