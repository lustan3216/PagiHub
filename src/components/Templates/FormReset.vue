<template>
  <flex-button
    :style="innerStyles"
    :id="id"
    default-text="Reset"
    @click="reset"
  />
</template>

<script>
import nodeMixin from './mixins/node'
import FlexButton from './FlexButton'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormInput'

export default {
  defaultSetting,
  name: 'FormReset',
  components: {
    FlexButton
  },
  mixins: [nodeMixin],
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
      if (!this.isExample) {
        this.rootForm.reset()
      }
    }
  }
}
</script>
