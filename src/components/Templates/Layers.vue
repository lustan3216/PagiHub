<template>
  <div class="relative h-100">
    <component-giver
      v-for="child in innerChildren"
      :controller="!child.sortIndex"
      :id="child.id"
      :key="child.id"
      :style="{ 'z-index': child.sortIndex }"
      :class="{ absolute: child.sortIndex }"
      :data-layer="Boolean(child.sortIndex)"
    />
  </div>
</template>

<script>
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
import ComponentGiver from '../TemplateUtils/ComponentGiver'

export default {
  name: 'Layers',
  components: {
    ComponentGiver
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
