<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <select-px label="Height" />
    </el-col>

    <el-col :span="12">
      <select-px label="Max-Height" />
    </el-col>

    <el-col :span="12">
      <select-px label="Min-Height" />
    </el-col>

    <el-col :span="24">
      <select-px label="Weight" />
    </el-col>

    <el-col :span="12">
      <select-px label="Max-Weight" />
    </el-col>

    <el-col :span="12">
      <select-px label="min-Weight" />
    </el-col>
  </el-row>
</template>

<script>
import SelectPx from '../Components/SelectPx'
export default {
  name: 'Dimension',
  components: {
    SelectPx
  }
}
</script>

<style scoped lang="scss"></style>
