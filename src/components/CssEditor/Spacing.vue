<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <p>Margin</p>
      <select-px :value.sync="margin" />
    </el-col>
    <el-col :span="12">
      <p>Margin Top</p>
      <select-px :value.sync="marginTop" />
    </el-col>
    <el-col :span="12">
      <p>Margin Right</p>
      <select-px :value.sync="marginRight" />
    </el-col>
    <el-col :span="12">
      <p>Margin Bottom</p>
      <select-px :value.sync="marginBottom" />
    </el-col>
    <el-col :span="12">
      <p>Margin Left</p>
      <select-px :value.sync="marginLeft" />
    </el-col>

    <el-col :span="24">
      <p>Padding</p>
      <select-px :value.sync="padding" />
    </el-col>
    <el-col :span="12">
      <p>Padding Top</p>
      <select-px :value.sync="paddingTop" />
    </el-col>
    <el-col :span="12">
      <p>Padding Right</p>
      <select-px :value.sync="paddingRight" />
    </el-col>
    <el-col :span="12">
      <p>Padding Bottom</p>
      <select-px :value.sync="paddingBottom" />
    </el-col>
    <el-col :span="12">
      <p>Padding Left</p>
      <select-px :value.sync="paddingLeft" />
    </el-col>
  </el-row>
</template>

<script>
import SelectPx from './Components/SelectPx'
import styleFourAttrsMixin from '../../mixins/styleFourAttrs'
import style from '../../mixins/style'

const margin = 'margin'
const padding = 'padding'

const margins = ['marginTop', 'marginRight', 'marginBottom', 'marginLeft']
const paddings = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']

export default {
  name: 'Spacing',
  components: {
    SelectPx
  },
  mixins: [style, styleFourAttrsMixin(margin, margins), styleFourAttrsMixin(padding, paddings)]
}
</script>

<style scoped lang="scss"></style>
