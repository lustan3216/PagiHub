<template>
  <grid-generator-inner
    :id="id"
    :inner-props="innerProps"
    :inner-style="innerStyles"
  />
</template>

<script>
import gridGeneratorInner from './GridGeneratorInner'
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormGenerator'

export default {
  defaultSetting,
  name: 'FormGenerator',
  components: {
    gridGeneratorInner
  },
  mixins: [nodeMixin, childrenMixin],
  provide() {
    if (this.isExample) return

    const isRootForm = this.$store.getters['draft/isRootForm'](this.id)
    if (isRootForm) {
      return { rootForm: this }
    }
  },
  data() {
    return {
      form: {},
      isValidObject: {},
      button: {}
    }
  },
  computed: {
    isValid() {
      return Object.values(this.isValidObject).every(value => value)
    }
  },
  methods: {
    submit() {
      // console.log(this.form)
    },
    reset() {
      this.form = {}
    },
    updateForm(title, value) {
      this.$set(this.form, title, value)
    },
    updateSubmit(submit) {
      this.button.submit = submit
    },
    updateReset(reset) {
      this.button.reset = reset
    },
    updateValid(title, isValid) {
      this.$set(this.isValidObject, title, isValid)
    }
  }
}
</script>
