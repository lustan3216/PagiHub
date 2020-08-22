<template>
  <controller-layer
    :id="id"
    class="h-100"
  >
    <grid-generator
      v-for="child in innerChildren"
      :key="child.id"
      :id="child.id"
      :style="{ 'z-index': child.sortIndex }"
      :class="{ absolute: child.sortIndex }"
      :data-layer="Boolean(child.sortIndex)"
    />
  </controller-layer>
</template>

<script>
import GridGenerator from './GridGenerator'
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
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
