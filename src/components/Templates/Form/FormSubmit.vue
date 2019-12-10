<template>
  <flex-button :disabled="disabled" default-text="Submit" @click="submit" :id="id" />
</template>

<script>
import commonMixin from '../../../mixins/common'
import FlexButton from '../FlexButton'
import { defaultSetting } from '../../../settings/formItem/formInput'

export default {
  defaultSetting,
  name: 'FlexSubmit',
  components: {
    FlexButton
  },
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
