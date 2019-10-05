<template>
  <div>
    <component
      v-for="child in innerChildren"
      :is="child.tag"
      :key="child.id"
      :id="child.id"
    />
  </div>
</template>

<script>
import GridGenerator from './GridGenerator'
import commonMixin from '../../mixins/common'
import childrenMixin from '../../mixins/children'

export default {
  name: 'Layers',
  components: {
    GridGenerator
  },
  mixins: [commonMixin, childrenMixin]
}
</script>
