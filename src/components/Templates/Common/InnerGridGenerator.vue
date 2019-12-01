<template>
  <grid-generator ref="grid" :id="id" :children="children">
    <template v-slot="props">
      <component-add :id="props.child.id" :children="props.child.children" />
    </template>
  </grid-generator>
</template>

<script>
import GridGenerator from '../GridGenerator'
import ComponentAdd from '../ComponentAdd'

export default {
  name: 'InnerGridGenerator',
  components: {
    ComponentAdd,
    GridGenerator
  },
  props: {
    id: {
      type: Number
    },
    children: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    updateChildren(value) {
      this.$refs.grid.innerChildren = value
    }
  }
}
</script>
