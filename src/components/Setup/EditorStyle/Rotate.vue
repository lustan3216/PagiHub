<template>
  <el-row
    type="flex"
    align="middle"
  >
    <el-col :span="8">
      <span class="title p-r-10">Rotate</span>
    </el-col>

    <el-col :span="16">
      <select-unit
        :units="[]"
        v-model="innerValue"
        :min="0"
        :max="360"
        prefix-icon="el-icon-refresh"
      />
    </el-col>
  </el-row>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
export default {
  name: 'Rotate',
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
      innerValue: this.value
    }
  },
  watch: {
    innerValue(opacity) {
      this.$emit('change', { opacity })
    }
  }
}
</script>
