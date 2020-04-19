<template>
  <div>
    <el-row
      :gutter="5"
      class="m-t-10"
    >
      <el-col :span="17">
        <el-select
          v-model="klass"
          multiple
          allow-create
          class="w-100"
          size="small"
          placeholder="Class"
        />
        <span class="el-form-item__label">Class</span>
      </el-col>

      <el-col :span="7">
        <el-select
          v-model="value"
          placeholder="State"
          size="small"
        >
          <el-option value="Hover"/>
          <el-option value="Click"/>
        </el-select>
        <span class="el-form-item__label">State</span>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: 'ClassState',
  props: {
    computedStyle: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isCornerAll: true
    }
  }
}
</script>
