<template>
  <div>
    <div>
      <label>Border</label>
      <div class="vertical-center">
        <input-style-unit :value.sync="borderWidth" />
        <select-border-style :value.sync="borderStyle" />
        <el-color-picker v-model="borderColor" />
      </div>
    </div>

    <div>
      <label>BorderTop</label>
      <div class="vertical-center">
        <input-style-unit :value.sync="borderWidthTop" />
        <select-border-style :value.sync="borderStyleTop" />
        <el-color-picker v-model="borderColorTop" />
      </div>
    </div>

    <div>
      <label>BorderRight</label>
      <div class="vertical-center">
        <input-style-unit :value.sync="borderWidthRight" />
        <select-border-style :value.sync="borderStyleRight" />
        <el-color-picker v-model="borderColorRight" />
      </div>
    </div>

    <div>
      <label>BorderBottom</label>
      <div class="vertical-center">
        <input-style-unit :value.sync="borderWidthBottom" />
        <select-border-style :value.sync="borderStyleBottom" />
        <el-color-picker v-model="borderColorBottom" />
      </div>
    </div>

    <div>
      <label>BorderLeft</label>
      <div class="vertical-center">
        <input-style-unit :value.sync="borderWidthLeft" />
        <select-border-style :value.sync="borderStyleLeft" />
        <el-color-picker v-model="borderColorLeft" />
      </div>
    </div>
  </div>
</template>

<script>
import InputStyleUnit from './Components/SelectUnit'
import SelectBorderStyle from './Components/SelectBorderStyle'
import styleMixin from '../../mixins/style'
import styleFourAttrsMixin from '../../mixins/styleFourAttrs'

const borderWidth = 'borderWidth'
const borderWidths = ['borderWidthTop', 'borderWidthRight', 'borderWidthBottom', 'borderWidthLeft']

const borderStyle = 'borderStyle'
const borderStyles = ['borderStyleTop', 'borderStyleRight', 'borderStyleBottom', 'borderStyleLeft']

const borderColor = 'borderColor'
const borderColors = ['borderColorTop', 'borderColorRight', 'borderColorBottom', 'borderColorLeft']

export default {
  name: 'Border',
  components: {
    InputStyleUnit,
    SelectBorderStyle
  },
  mixins: [
    styleMixin,
    styleFourAttrsMixin(borderWidth, borderWidths),
    styleFourAttrsMixin(borderStyle, borderStyles),
    styleFourAttrsMixin(borderColor, borderColors)
  ]
}
</script>

<style scoped lang="scss"></style>
