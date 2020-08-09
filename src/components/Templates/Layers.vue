<template>
  <div class="relative h-100">
    <controller-layer
      v-for="(child, index) in sortChildren"
      :border="false"
      :id="child.id"
      :key="child.id"
    >
      <grid-generator
        :style="{ 'z-index': index }"
        :class="{ absolute: index }"
        :id="child.id"
        :data-layer="Boolean(index)"
      />
    </controller-layer>
  </div>
</template>

<script>
import GridGenerator from './GridGenerator'
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
import { SORT_INDEX } from '@/const'
import ControllerLayer from '../TemplateUtils/ControllerLayer'

export default {
  name: 'Layers',
  components: {
    GridGenerator,
    ControllerLayer
  },
  mixins: [nodeMixin, childrenMixin],
  computed: {
    sortChildren() {
      return Array.from(this.innerChildren).sort(
        (a, b) => b[SORT_INDEX] - a[SORT_INDEX]
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
