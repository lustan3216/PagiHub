<template>
  <el-button :style="innerStyles" class="wh-100 m-0">
    <slot>{{ text }}</slot>
  </el-button>
</template>

<script>
import commonMixin from '../../mixins/common'

export default {
  name: 'FlexButton',
  mixins: [commonMixin],
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
