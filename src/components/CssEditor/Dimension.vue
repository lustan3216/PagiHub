<template>
  <div>
    <el-row
      :gutter="5"
      class="m-t-10"
    >
      <el-col :span="8">
        <el-form-item label="Height">
          <select-unit :value.sync="computedStyle.height" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="Min Height">
          <select-unit :value.sync="computedStyle.minHeight" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="Max Height">
          <select-unit :value.sync="computedStyle.maxHeight" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row
      :gutter="5"
      class="m-t-10"
    >
      <el-col :span="8">
        <el-form-item label="Width">
          <select-unit :value.sync="computedStyle.width" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="Min Width">
          <select-unit :value.sync="computedStyle.minWidth" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="Max Width">
          <select-unit :value.sync="computedStyle.maxWidth" />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SelectUnit from '../Components/SelectUnit'

export default {
  name: 'Dimension',
  components: {
    SelectUnit
  },
  props: {
    computedStyle: {
      type: Object,
      required: true
    }
  }
}
</script>
