<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-switch v-model="isAll" active-text="All" inactive-text="Separate" />
    </el-col>

    <template v-if="isAll">
      <el-col :span="24">
        <p>Padding</p>
        <input-style-unit :value.sync="computedStyle.padding" />
      </el-col>
    </template>

    <template v-else>
      <el-col :span="12">
        <p>Padding Top</p>
        <input-style-unit :value.sync="computedStyle.paddingTop" />
      </el-col>

      <el-col :span="12">
        <p>Padding Right</p>
        <input-style-unit :value.sync="computedStyle.paddingRight" />
      </el-col>

      <el-col :span="12">
        <p>Padding Bottom</p>
        <input-style-unit :value.sync="computedStyle.paddingBottom" />
      </el-col>

      <el-col :span="12">
        <p>Padding Left</p>
        <input-style-unit :value.sync="computedStyle.paddingLeft" />
      </el-col>
    </template>
  </el-row>
</template>

<script>
import InputStyleUnit from './Components/SelectUnit'

export default {
  name: 'PaddingPart',
  components: {
    InputStyleUnit
  },
  props: ['computedStyle'],
  data() {
    return {
      isAll: true
    }
  }
}
</script>

<style scoped lang="scss"></style>
