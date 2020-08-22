<template>
  <div class="relative h-100">
    <template v-for="(child, index) in innerChildren">
      <controller-layer
        v-if="index === 0"
        :id="child.id"
        :key="child.id"
      >
        <grid-generator :id="child.id" />
      </controller-layer>

      <grid-generator
        v-else
        :id="child.id"
        :style="{ 'z-index': index }"
        :class="{ absolute: index }"
        :data-layer="Boolean(index)"
      />
    </template>
  </div>
</template>

<script>
import GridGenerator from './GridGenerator'
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
import { SORT_INDEX } from '@/const'
import ControllerLayer from '../TemplateUtils/ControllerLayer'

export default {
  name: 'ComponentBody',
  components: {
    GridGenerator,
    ControllerLayer
  },
  mixins: [nodeMixin, childrenMixin]
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
