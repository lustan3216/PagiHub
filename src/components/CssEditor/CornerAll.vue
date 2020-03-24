<template>
  <el-form-item v-if="isAll" label="All Corner">
    <input-style-unit :value.sync="computedStyle.borderRadius" />
  </el-form-item>
</template>

<script>
import InputStyleUnit from './Components/SelectUnit'

export default {
  name: 'Corner',
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
