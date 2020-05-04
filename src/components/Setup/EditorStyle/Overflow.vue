<template>
  <div>
    <span class="title p-r-10">Overflow</span>
    <el-select
      v-model="innerValue"
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
  },
  data() {
    return {
      innerValue: this.value
    }
  },
  watch: {
    innerValue(overflow) {
      this.$emit('change', { overflow })
    }
  }
}
</script>

<style scoped lang="scss"></style>
