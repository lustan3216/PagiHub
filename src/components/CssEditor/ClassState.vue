<template>
  <div>
    <el-row :gutter="5" class="m-t-10">
      <el-col :span="17">
        <el-form-item>
          <el-select
            v-model="klass"
            multiple
            allow-create
            class="w-100"
            size="small"
            placeholder="Class"/>
        </el-form-item>
      </el-col>

      <el-col :span="7">
        <el-form-item>
          <el-select v-model="value" placeholder="State" size="small">
            <el-option value="Hover"/>
            <el-option value="Click"/>
          </el-select>
        </el-form-item>
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
