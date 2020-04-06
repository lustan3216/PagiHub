<template>
  <grid-generator v-if="hasAnyChild" :id="firstChild.id" />
</template>

<script>
import GridGenerator from '../GridGenerator'
import nodeMixin from '../../../mixins/node'
import childrenMixin from '../../../mixins/children'
import { defaultSetting } from '../../../settings/formGenerator'

export default {
  defaultSetting,
  name: 'FormGenerator',
  components: {
    GridGenerator
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
