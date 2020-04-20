<template>
  <div class="relative h-100">
    <grid-generator
      v-for="(child, index) in sortChildren"
      :style="{ 'z-index': index }"
      :class="{ absolute: index }"
      :key="child.id"
      :id="child.id"
    />
  </div>
</template>

<script>
import GridGenerator from './GridGenerator'
import GridItemChild from './GridItemChild'
import NodeController from '../TemplateUtils/NodeController'
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
import { SORT_INDEX } from '@/const'

export default {
  name: 'RootLayers',
  components: {
    GridGenerator,
    GridItemChild,
    NodeController
  },
  mixins: [nodeMixin, childrenMixin],
  computed: {
    sortChildren() {
      return Array.from(this.innerChildren).sort(
        (a, b) => a[SORT_INDEX] - b[SORT_INDEX]
      )
    }
  }
}
</script>

<style scoped>
.absolute {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
</style>
