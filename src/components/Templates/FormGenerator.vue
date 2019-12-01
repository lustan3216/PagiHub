<template>
  <inner-grid-generator ref="grid" :id="id" :children="children"/>
</template>

<script>
import InnerGridGenerator from './Common/InnerGridGenerator'
import commonMixin from '../../mixins/common'
import childrenMixin from '../../mixins/children'
import settings from '../../settings/formGenerator'

export default {
  settingsTemplate: settings(),
  name: 'FormGenerator',
  components: {
    InnerGridGenerator
  },
  mixins: [commonMixin, childrenMixin],
  provide() {
    if (!this.isEditable) return
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
  watch: {
    innerChildren(value) {
      this.$refs.grid.updateChildren(value)
    }
  },
  methods: {
    submit() {
      console.log(this.form)
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
