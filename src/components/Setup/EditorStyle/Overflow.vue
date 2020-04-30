<template>
  <div>
    <span class="title p-r-10">Overwrite</span>
    <el-select
      :value="value"
      @input="$emit('input', $event)"
    >
      <el-option
        label="visible"
        value="visible"
      />
      <el-option
        label="auto"
        value="auto"
      />
      <el-option
        label="hidden"
        value="hidden"
      />
      <el-option
        label="scroll"
        value="scroll"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'Overflow',
  props: {
    value: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss"></style>
