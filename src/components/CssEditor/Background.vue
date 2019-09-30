<template>
  <el-form
    label-position="top"
    label-width="80px">
    <el-form-item label="Color">
      <el-color-picker v-model="color" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Background',
  data() {
    return {
      color: null
    }
  }
}
</script>

<style scoped lang="scss"></style>

