<template >
  <el-select
    :value="value"
    size="mini"
    @input="$emit('update:value', $event)"
  >
    <el-option
      value="none"
      label="None" />
    <el-option
      value="dashed"
      label="Dashed" />
    <el-option
      value="dotted"
      label="Dotted" />
    <el-option
      value="solid"
      label="Solid" />
  </el-select>
</template>

<script>
export default {
  name: 'SelectBorderStyle',
  props: {
    value: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss"></style>
