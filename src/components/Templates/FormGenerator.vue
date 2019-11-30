<template>
  <grid-generator ref="grid" :id="id" :children="children">
    <template v-slot="props">
      <component-add :id="props.child.id" :children="props.child.children" />
    </template>
  </grid-generator>
</template>

<script>
import GridGenerator from './GridGenerator'
import commonMixin from '../../mixins/common'
import childrenMixin from '../../mixins/children'
import ComponentAdd from './ComponentAdd'

export default {
  name: 'FormGenerator',
  components: {
    ComponentAdd,
    GridGenerator
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
      this.$refs.grid.innerChildren = value
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
      this.form[title] = value
    },
    updateSubmit(submit) {
      this.button.submit = submit
    },
    updateReset(reset) {
      this.button.reset = reset
    },
    updateValid(title, isValid) {
      this.isValidObject[title] = isValid
    }
  }
}
</script>
