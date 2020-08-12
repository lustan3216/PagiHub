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
        :units="['deg']"
        v-model="innerValue"
        allow-negative
        :min="-360"
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
  computed: {
    innerValue: {
      get() {
        const rotate = this.value.match(/rotate\(([^(]+)\)/) || []
        return rotate[1]
      },
      set(newRotate) {
        const rotate = this.value.match(/rotate\(([^(]+)\)/) || []
        const oldRotate = rotate[1]
        let transform

        if (newRotate) {
          transform = oldRotate
            ? this.value.replace(oldRotate, newRotate)
            : this.value
              ? this.value + ` rotate(${newRotate})`
              :`rotate(${newRotate})`
        } else {
          transform = this.value.replace(rotate[0], '').trim()
        }
        this.$emit('change', { transform })
      },
    }
  }
}
</script>
