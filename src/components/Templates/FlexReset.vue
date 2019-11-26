<template>
  <el-button :style="innerStyles" class="wh-100 m-0" @click="reset">
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
  inject: ['rootForm'],
  created() {
    if (this.isEditable) {
      this.rootForm.updateReset(this.id)
    }
  },
  beforeDestroy() {
    if (this.isEditable) {
      this.rootForm.updateReset(null)
    }
  },
  methods: {
    reset() {
      this.rootForm.reset()
    }
  }
}
</script>
