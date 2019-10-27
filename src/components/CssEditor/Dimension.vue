<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <p>Height</p>
      <select-px :value.sync="height" />
    </el-col>

    <el-col :span="12">
      <p>min-Height</p>
      <select-px :value.sync="minHeight" />
    </el-col>

    <el-col :span="12">
      <p>max-Height</p>
      <select-px :value.sync="maxHeight" />
    </el-col>

    <el-col :span="24">
      <p>Width</p>
      <select-px :value.sync="width" />
    </el-col>

    <el-col :span="12">
      <p>min-Width</p>
      <select-px :value.sync="minWidth" />
    </el-col>

    <el-col :span="12">
      <p>max-Width</p>
      <select-px :value.sync="maxWidth" />
    </el-col>
  </el-row>
</template>

<script>
import SelectPx from './Components/SelectPx'
import styleOneAttr from '../../mixins/styleOneAttr'
import styleMixin from '../../mixins/style'

const dimensions = ['height', 'minHeight', 'maxHeight', 'width', 'minWidth', 'maxWidth']

export default {
  name: 'Dimension',
  components: {
    SelectPx
  },
  mixins: [styleMixin, styleOneAttr(dimensions)]
}
</script>

<style scoped lang="scss"></style>
