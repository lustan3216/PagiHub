<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <div>
        <p><label for="Border">Border</label></p>
        <select-px />
        <el-select v-model="style">
          <el-option value="Dashed">Dashed</el-option>
          <el-option value="Dotted">Dotted</el-option>
          <el-option value="Solid">Solid</el-option>
        </el-select>
        <el-color-picker v-model="color" />
      </div>
    </el-col>

    <el-col :span="24">
      <div>
        <p><label for="Border">Border-Top</label></p>
        <select-px />
        <el-select v-model="style">
          <el-option value="Dashed">Dashed</el-option>
          <el-option value="Dotted">Dotted</el-option>
          <el-option value="Solid">Solid</el-option>
        </el-select>
        <el-color-picker v-model="color" />
      </div>
    </el-col>

    <el-col :span="24">
      <div>
        <p><label for="Border">Border Right</label></p>
        <select-px />
        <el-select v-model="style">
          <el-option value="Dashed">Dashed</el-option>
          <el-option value="Dotted">Dotted</el-option>
          <el-option value="Solid">Solid</el-option>
        </el-select>
        <el-color-picker v-model="color" />
      </div>
    </el-col>

    <el-col :span="24">
      <div>
        <p><label for="Border">Border Bottom</label></p>
        <select-px />
        <el-select v-model="style">
          <el-option value="Dashed">Dashed</el-option>
          <el-option value="Dotted">Dotted</el-option>
          <el-option value="Solid">Solid</el-option>
        </el-select>
        <el-color-picker v-model="color" />
      </div>
    </el-col>

    <el-col :span="24">
      <div>
        <p><label for="Border">Border Left</label></p>
        <select-px />
        <el-select v-model="style">
          <el-option value="Dashed">Dashed</el-option>
          <el-option value="Dotted">Dotted</el-option>
          <el-option value="Solid">Solid</el-option>
        </el-select>
        <el-color-picker v-model="color" />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import SelectPx from '../Components/SelectPx'
export default {
  name: 'Border',
  components: {
    SelectPx
  },
  data() {
    return {
      style: null,
      color: null
    }
  }
}
</script>

<style scoped lang="scss"></style>
