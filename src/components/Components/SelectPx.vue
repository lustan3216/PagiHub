<template>
  <div>
    <p v-if="label">
      <label :for="label">{{ label }}</label>
    </p>
    <el-input
      :id="label"
      :disabled="isAuto"
      v-model="input"
      size="mini"
      type="number"
      placeholder="0">
      <el-select
        slot="append"
        v-model="select">
        <el-option
          label="px"
          value="px" />
        <el-option
          label="auto"
          value="auto" />
        <el-option
          label="%"
          value="%" />
        <el-option
          label="vh"
          value="vh" />
        <el-option
          label="vw"
          value="vw" />
      </el-select>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'SelectPx',
  props: {
    auto: {
      type: Boolean,
      default: false
    },
    allowNegative: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      input: null,
      select: 'px'
    }
  },
  computed: {
    isAuto() {
      return this.select === 'auto'
    },
    value() {
      return this.input + this.select
    }
  },
  watch: {
    value(value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep {
  .el-input-group__append,
  .el-input-group__prepend {
    width: 35px;
  }
}
</style>
