<template>
  <flex-button
    :style="innerStyles"
    :id="id"
    default-text="Submit"
    @click.native="submit"
  />
</template>

<script>
import nodeMixin from '../../../mixins/node'
import FlexButton from '../FlexButton'
import { defaultSetting } from '../../../settings/formItem/formInput'

export default {
  defaultSetting,
  name: 'FlexSubmit',
  components: {
    FlexButton
  },
  mixins: [nodeMixin],
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
    if (!this.isExample) {
      this.rootForm.updateSubmit(this.id)
    }
  },
  beforeDestroy() {
    if (!this.isExample) {
      this.rootForm.updateSubmit(null)
    }
  },
  methods: {
    submit() {
      if (!this.isExample) {
        this.rootForm.submit()
      }
    }
  }
}
</script>
