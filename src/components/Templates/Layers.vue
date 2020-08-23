<template>
  <div class="relative h-100">
    <async-component
      v-for="child in innerChildren"
      :id="child.id"
      :key="child.id"
      :style="{ 'z-index': child.sortIndex }"
      :class="{ absolute: child.sortIndex }"
      :data-layer="Boolean(child.sortIndex)"
    />
  </div>
</template>

<script>
import GridGenerator from './GridGenerator'
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
import AsyncComponent from '../TemplateUtils/AsyncComponent'

export default {
  name: 'Layers',
  components: {
    GridGenerator,
    AsyncComponent
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
