<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <p>Height</p>
      <input-style-unit :value.sync="height" />
    </el-col>

    <el-col :span="12">
      <p>min-Height</p>
      <input-style-unit :value.sync="minHeight" />
    </el-col>

    <el-col :span="12">
      <p>max-Height</p>
      <input-style-unit :value.sync="maxHeight" />
    </el-col>

    <el-col :span="24">
      <p>Width</p>
      <input-style-unit :value.sync="width" />
    </el-col>

    <el-col :span="12">
      <p>min-Width</p>
      <input-style-unit :value.sync="minWidth" />
    </el-col>

    <el-col :span="12">
      <p>max-Width</p>
      <input-style-unit :value.sync="maxWidth" />
    </el-col>
  </el-row>
</template>

<script>
import InputStyleUnit from './Components/SelectUnit'
import styleOneAttr from '../../mixins/styleOneAttr'
import styleMixin from '../../mixins/style'

const dimensions = ['height', 'minHeight', 'maxHeight', 'width', 'minWidth', 'maxWidth']

export default {
  name: 'Dimension',
  components: {
    InputStyleUnit
  },
  mixins: [styleMixin, styleOneAttr(dimensions)]
}
</script>

<style scoped lang="scss"></style>
