<template>
  <div>
    <el-row
      :gutter="5"
      class="m-t-10"
    >
      <el-col :span="8">

        <select-unit v-model="computedStyle.height" />
        <span class="el-form-item__label">Height</span>
      </el-col>

      <el-col :span="8">

        <select-unit v-model="computedStyle.minHeight" />
        <span class="el-form-item__label">Min Height</span>
      </el-col>

      <el-col :span="8">

        <select-unit v-model="computedStyle.maxHeight" />
        <span class="el-form-item__label">Max Height</span>
      </el-col>
    </el-row>

    <el-row
      :gutter="5"
      class="m-t-10"
    >
      <el-col :span="8">

        <select-unit v-model="computedStyle.width" />
        <span class="el-form-item__label">Width</span>
      </el-col>

      <el-col :span="8">

        <select-unit v-model="computedStyle.minWidth" />
        <span class="el-form-item__label">Min Width</span>
      </el-col>

      <el-col :span="8">

        <select-unit v-model="computedStyle.maxWidth" />
        <span class="el-form-item__label">Max Width</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'

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
