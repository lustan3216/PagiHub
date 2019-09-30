<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <select-px label="Margin" />
    </el-col>
    <el-col :span="12">
      <select-px label="Margin-top" />
    </el-col>
    <el-col :span="12">
      <select-px label="Margin-right" />
    </el-col>
    <el-col :span="12">
      <select-px label="Margin-bottom" />
    </el-col>
    <el-col :span="12">
      <select-px label="Margin-left" />
    </el-col>

    <el-col :span="24">
      <select-px label="Padding" />
    </el-col>
    <el-col :span="12">
      <select-px label="Padding-top" />
    </el-col>
    <el-col :span="12">
      <select-px label="Padding-right" />
    </el-col>
    <el-col :span="12">
      <select-px label="Padding-bottom" />
    </el-col>
    <el-col :span="12">
      <select-px label="Padding-left" />
    </el-col>
  </el-row>
</template>

<script>
import SelectPx from '../Components/SelectPx'
export default {
  name: 'Spacing',
  components: {
    SelectPx
  }
}
</script>

<style scoped lang="scss"></style>
