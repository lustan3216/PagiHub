<template>
  <edit-bar :id="id" >
    <el-button :style="innerStyles">
      <slot>{{ text }}</slot>
    </el-button>
  </edit-bar>
</template>

<script>
import commonMixin from '../../mixins/common'
import EditBar from '../Components/EditBar'

export default {
  name: 'FlexButton',
  components: {
    EditBar
  },
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
