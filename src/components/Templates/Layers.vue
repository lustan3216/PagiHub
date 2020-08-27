<template>
  <div class="relative h-100">
    <template v-for="child in innerChildren">
      <controller-layer
        v-if="child.sortIndex === 0"
        :id="child.id"
        :key="child.id"
      >
        <grid-generator :id="child.id" />
      </controller-layer>

      <grid-generator
        v-else
        :id="child.id"
        :key="child.id"
        :style="{ 'z-index': child.sortIndex }"
        :class="{ absolute: child.sortIndex }"
        :data-layer="Boolean(child.sortIndex)"
      />
    </template>
  </div>
</template>

<script>
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import GridGenerator from '../Templates/GridGenerator'

export default {
  name: 'Layers',
  components: {
    ControllerLayer,
    GridGenerator
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
