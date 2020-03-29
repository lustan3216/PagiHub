<template>
  <grid-generator :id="firstChild.id" :children="firstChild.children" />
</template>

<script>
import GridGenerator from '../GridGenerator'
import commonMixin from '../../../mixins/common'
import childrenMixin from '../../../mixins/children'
import { defaultSetting } from '../../../settings/formGenerator'

export default {
  defaultSetting,
  name: 'FormGenerator',
  components: {
    GridGenerator
  },
  mixins: [commonMixin, childrenMixin],
  provide() {
    if (this.isDemonstrated) return

    const parentPath = this.$store.getters['nodes/parentPath']
    const isRootForm = parentPath(this.id).every(
      x => x.tag !== 'form-generator'
    )
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
