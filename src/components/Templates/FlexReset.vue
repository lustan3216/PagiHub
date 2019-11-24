<template>
  <el-button :style="innerStyles" class="wh-100 m-0" @click="rootForm.reset">
    <slot>{{ text }}</slot>
  </el-button>
</template>

<script>
import commonMixin from '../../mixins/common'

export default {
  name: 'FlexReset',
  mixins: [commonMixin],
  props: {
    text: {
      type: String,
      default: 'Reset'
    }
  },
  inject: ['rootForm']
}
</script>
