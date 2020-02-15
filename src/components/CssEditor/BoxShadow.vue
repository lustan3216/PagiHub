<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <p>Horizontal Length</p>
      <input-unit :value.sync="horizontal" unit="px" />
    </el-col>

    <el-col :span="12">
      <p>Vertical Length</p>
      <input-unit :value.sync="vertical" unit="px" />
    </el-col>

    <el-col :span="12">
      <p>Blur Radius</p>
      <input-unit :value.sync="blur" unit="px" />
    </el-col>

    <el-col :span="12">
      <p>Spread Radius</p>
      <input-unit :value.sync="spread" unit="px" />
    </el-col>

    <el-col :span="8">
      <p>Shadow Color</p>
      <el-color-picker v-model="color" show-alpha />
    </el-col>

    <el-col :span="16">
      <p>Shadow Color</p>
      <el-radio v-model="radio" label="Outline">Outline</el-radio>
      <el-radio v-model="radio" label="Inset">Inset</el-radio>
    </el-col>
  </el-row>
</template>

<script>
import InputUnit from './Components/InputUnit'

export default {
  name: 'BoxShadow',
  components: {
    InputUnit
  },
  props: ['inset'],
  data() {
    return {
      inset: false,
      offsetX: undefined,
      offsetY: undefined,
      blurRadius: undefined,
      spreadRadius: undefined,
      color: 'none'
    }
  },
  computed: {
    isNone() {
      return this.boxShadow === 'none'
    },
    match() {
      if (this.isNone) {
        return ['', '', '', '', '', '']
      } else if (this.boxShadow.includes('inset')) {
        return this.boxShadow.split(' ')
      } else {
        return this.boxShadow.split(' ').unshift('')
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
