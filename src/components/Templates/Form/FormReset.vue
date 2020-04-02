<template>
  <flex-button
    :style="innerStyles"
    :id="id"
    default-text="Reset"
    @click="reset" />
</template>

<script>
import commonMixin from '../../../mixins/common'
import FlexButton from '../FlexButton'
import { defaultSetting } from '../../../settings/formItem/formInput'

export default {
  defaultSetting,
  name: 'FormReset',
  components: {
    FlexButton
  },
  mixins: [commonMixin],
  inject: ['rootForm'],
  created() {
    if (!this.isExample) {
      this.rootForm.updateReset(this.id)
    }
  },
  beforeDestroy() {
    if (!this.isExample) {
      this.rootForm.updateReset(null)
    }
  },
  methods: {
    reset() {
      this.rootForm && this.rootForm.reset()
    }
  }
}
</script>
