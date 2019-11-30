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
  name: 'FormGroup',
  components: {
    ComponentAdd,
    GridGenerator
  },
  mixins: [commonMixin, childrenMixin],
  watch: {
    innerChildren(value) {
      this.$refs.grid.innerChildren = value
    }
  }
}
</script>
