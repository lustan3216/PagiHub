<template>
  <grid-generator :id="id" :is-editable="isEditable">
    <template v-slot="props">
      <component-add :id="props.id" />
    </template>
  </grid-generator>
</template>

<script>
import GridGenerator from './GridGenerator'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import ComponentAdd from './ComponentAdd'

export default {
  name: 'FormGenerator',
  components: {
    ComponentAdd,
    GridGenerator
  },
  mixins: [childrenMixin, commonMixin]
}
</script>
