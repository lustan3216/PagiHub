<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-switch v-model="isAll" active-text="All" inactive-text="Separate" />
    </el-col>
    
    <template v-if="isAll">
      <el-col :span="24">
        <p>Margin</p>
        <input-style-unit :value.sync="computedStyle.margin" />
      </el-col>
    </template>

    <template v-else>
      <el-col :span="12">
        <p>Margin Top</p>
        <input-style-unit :value.sync="computedStyle.marginTop" />
      </el-col>

      <el-col :span="12">
        <p>Margin Right</p>
        <input-style-unit :value.sync="computedStyle.marginRight" />
      </el-col>

      <el-col :span="12">
        <p>Margin Bottom</p>
        <input-style-unit :value.sync="computedStyle.marginBottom" />
      </el-col>

      <el-col :span="12">
        <p>Margin Left</p>
        <input-style-unit :value.sync="computedStyle.marginLeft" />
      </el-col>
    </template>
  </el-row>
</template>

<script>
import InputStyleUnit from './Components/SelectUnit'

export default {
  name: 'Spacing',
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
