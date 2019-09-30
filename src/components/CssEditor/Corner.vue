<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <select-px label="Border" />
    </el-col>

    <el-col :span="12">
      <select-px label="Border-Top-right" />
    </el-col>

    <el-col :span="12">
      <select-px label="Border-Bottom-right" />
    </el-col>

    <el-col :span="12">
      <select-px label="Border-Bottom-left" />
    </el-col>

    <el-col :span="12">
      <select-px label="Border-Top-left" />
    </el-col>
  </el-row>
</template>

<script>
import SelectPx from '../Components/SelectPx'
export default {
  name: 'Corner',
  components: {
    SelectPx
  }
}
</script>

<style scoped lang="scss"></style>
