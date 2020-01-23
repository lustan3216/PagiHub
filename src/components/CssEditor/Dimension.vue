<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <p>Height</p>
      <input-style-unit :value.sync="computedStyle.height" />
    </el-col>

    <el-col :span="12">
      <p>min-Height</p>
      <input-style-unit :value.sync="computedStyle.minHeight" />
    </el-col>

    <el-col :span="12">
      <p>max-Height</p>
      <input-style-unit :value.sync="computedStyle.maxHeight" />
    </el-col>

    <el-col :span="24">
      <p>Width</p>
      <input-style-unit :value.sync="computedStyle.width" />
    </el-col>

    <el-col :span="12">
      <p>min-Width</p>
      <input-style-unit :value.sync="computedStyle.minWidth" />
    </el-col>

    <el-col :span="12">
      <p>max-Width</p>
      <input-style-unit :value.sync="computedStyle.maxWidth" />
    </el-col>
  </el-row>
</template>

<script>
import InputStyleUnit from './Components/SelectUnit'

export default {
  name: 'Dimension',
  components: {
    InputStyleUnit
  },
  props: ['computedStyle']
}
</script>

<style scoped lang="scss"></style>
