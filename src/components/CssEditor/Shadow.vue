<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <p><label for="Border">Horizontal Length</label></p>
      <select-px />
    </el-col>

    <el-col :span="24">
      <p><label for="Border">Vertical Length</label></p>
      <select-px />
    </el-col>

    <el-col :span="24">
      <p><label for="Border">Blur Radius</label></p>
      <select-px />
    </el-col>

    <el-col :span="24">
      <p><label for="Border">Spread Radius</label></p>
      <select-px />
    </el-col>

    <el-col :span="24">
      <p><label for="Border">Shadow Color</label></p>
      <el-color-picker v-model="color" />
    </el-col>

    <el-col :span="24">
      <p><label for="Border">Opacity</label></p>
      <select-px />
    </el-col>

    <el-col :span="24">
      <el-radio
        v-model="radio"
        label="Outline">Outline</el-radio>
      <el-radio
        v-model="radio"
        label="Inset">Inset</el-radio>
    </el-col>
  </el-row>
</template>

<script>
import SelectPx from './Components/SelectPx'
export default {
  name: 'Shadow',
  components: {
    SelectPx
  },
  data() {
    return {
      style: null,
      color: null,
      radio: null
    }
  }
}
</script>

<style scoped lang="scss"></style>
