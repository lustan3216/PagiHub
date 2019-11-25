<template>
  <grid-generator :id="id" :children="children">
    <template v-slot="props">
      <component-add :id="props.id" />
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
      isValidObject: {}
    }
  },
  computed: {
    isValid() {
      return Object.values(this.isValidObject).every(value => value)
    }
  },
  methods: {
    submit() {
      console.log(this.form)
    },
    reset() {
      this.form = {}
    },
    updateData(title, { isValid, value }) {
      this.form[title] = value
      this.isValidObject[title] = isValid
    }
  }
}
</script>
