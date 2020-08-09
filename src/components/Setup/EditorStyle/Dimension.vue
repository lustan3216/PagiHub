<template>
  <div>
    <el-divider content-position="left" >
      DIMENSION
    </el-divider>

    <el-row
      :gutter="10"
      type="flex"
      align="middle"
    >
      <el-col :span="4">
        <span class="title">Min H</span>
      </el-col>
      <el-col :span="12">
        <select-unit v-model="asd" />
      </el-col>

      <el-col :span="4">
        <span class="title">Max H</span>
      </el-col>
      <el-col :span="12">
        <select-unit v-model="asd" />
      </el-col>
    </el-row>

    <el-row
      :gutter="10"
      type="flex"
      align="middle"
    >
      <el-col :span="4">
        <span class="title">Min W</span>
      </el-col>
      <el-col :span="12">
        <select-unit v-model="asd" />
      </el-col>

      <el-col :span="4">
        <span class="title">Max W</span>
      </el-col>
      <el-col :span="12">

        <select-unit v-model="asd" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import { Divider } from 'element-ui'
export default {
  name: 'Dimension',
  components: {
    SelectUnit,
    ElDivider: Divider
  },
  data() {
    return {
      asd: ''
    }
  }
}
</script>
