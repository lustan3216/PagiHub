<template>
  <div
    v-free-style="innerStyles"
    class="relative h-100"
  >
    <controller-layer
      v-for="(child, index) in sortChildren"
      :id="child.id"
      :key="child.id"
    >
      <grid-generator
        :style="{ 'z-index': index }"
        :class="{ absolute: index }"
        :key="child.id"
        :id="child.id"
        :data-layer="Boolean(index)"
      />
    </controller-layer>
  </div>
</template>

<script>
import gridGenerator from './GridGenerator'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
import { SORT_INDEX } from '@/const'

export default {
  name: 'Layers',
  components: {
    gridGenerator,
    ControllerLayer
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
