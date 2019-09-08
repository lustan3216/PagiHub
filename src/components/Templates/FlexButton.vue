<template>
  <el-button>
    {{ text }}
    <slot/>
  </el-button>
</template>

<script>
import EditBar from '../Components/EditBar'

export default {
  name: 'FlexButton',
  components: {
    EditBar
  },
  props: {
    text: {
      type: String,
      default: '按鈕'
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-area {
  height: 100%;
}
</style>
