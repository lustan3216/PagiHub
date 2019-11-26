<template>
  <el-button
    :disabled="disabled"
    :style="innerStyles"
    class="wh-100 m-0"
    @click="submit"
  >
    <slot>{{ text }}</slot>
  </el-button>
</template>

<script>
import commonMixin from '../../mixins/common'

export default {
  name: 'FlexSubmit',
  mixins: [commonMixin],
  props: {
    text: {
      type: String,
      default: 'Submit'
    }
  },
  inject: ['rootForm'],
  computed: {
    disabled() {
      return !this.rootForm.isValid
    }
  },
  created() {
    if (this.isEditable) {
      this.rootForm.updateSubmit(this.id)
    }
  },
  beforeDestroy() {
    if (this.isEditable) {
      this.rootForm.updateSubmit(null)
    }
  },
  methods: {
    submit() {
      this.rootForm.submit()
    }
  }
}
</script>
