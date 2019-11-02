<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <p>Margin</p>
      <input-style-unit :value.sync="margin" />
    </el-col>
    <el-col :span="12">
      <p>Margin Top</p>
      <input-style-unit :value.sync="marginTop" />
    </el-col>
    <el-col :span="12">
      <p>Margin Right</p>
      <input-style-unit :value.sync="marginRight" />
    </el-col>
    <el-col :span="12">
      <p>Margin Bottom</p>
      <input-style-unit :value.sync="marginBottom" />
    </el-col>
    <el-col :span="12">
      <p>Margin Left</p>
      <input-style-unit :value.sync="marginLeft" />
    </el-col>

    <el-col :span="24">
      <p>Padding</p>
      <input-style-unit :value.sync="padding" />
    </el-col>
    <el-col :span="12">
      <p>Padding Top</p>
      <input-style-unit :value.sync="paddingTop" />
    </el-col>
    <el-col :span="12">
      <p>Padding Right</p>
      <input-style-unit :value.sync="paddingRight" />
    </el-col>
    <el-col :span="12">
      <p>Padding Bottom</p>
      <input-style-unit :value.sync="paddingBottom" />
    </el-col>
    <el-col :span="12">
      <p>Padding Left</p>
      <input-style-unit :value.sync="paddingLeft" />
    </el-col>
  </el-row>
</template>

<script>
import InputStyleUnit from './Components/SelectUnit'
import styleFourAttrsMixin from '../../mixins/styleFourAttrs'
import style from '../../mixins/style'

const margin = 'margin'
const padding = 'padding'

const margins = ['marginTop', 'marginRight', 'marginBottom', 'marginLeft']
const paddings = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']

export default {
  name: 'Spacing',
  components: {
    InputStyleUnit
  },
  mixins: [style, styleFourAttrsMixin(margin, margins), styleFourAttrsMixin(padding, paddings)]
}
</script>

<style scoped lang="scss"></style>
