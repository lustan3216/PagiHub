<template>
  <el-button :style="innerStyles" class="wh-100 m-0" @click="reset">
    <slot>123</slot>
  </el-button>
</template>

<script>
import commonMixin from '../../../mixins/common'
import { defaultSetting } from '../../../settings/formItem/formInput'

export default {
  defaultSetting,
  name: 'FormReset',
  mixins: [commonMixin],
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
