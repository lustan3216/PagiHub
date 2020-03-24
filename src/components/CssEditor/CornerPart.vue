<template>
  <div>
    <el-form-item label="Top Left">
      <input-style-unit :value.sync="computedStyle.borderTopLeftRadius" />
    </el-form-item>
  
    <el-form-item label="Top Right">
      <input-style-unit :value.sync="computedStyle.borderTopRightRadius" />
    </el-form-item>
  
    <el-form-item label="Bottom Right">
      <input-style-unit :value.sync="computedStyle.borderBottomRightRadius" />
    </el-form-item>
  
    <el-form-item label="Bottom Left">
      <input-style-unit :value.sync="computedStyle.borderBottomLeftRadius" />
    </el-form-item>
  </div>
</template>

<script>
import InputStyleUnit from './Components/SelectUnit'

export default {
  name: 'CornerPart',
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
