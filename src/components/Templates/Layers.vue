<template>
  <div class="layers">
    <div
      v-for="(child, index) in innerChildren"
      :style="{ 'z-index': index, ...innerStyles }"
      :class="{ absolute: index }"
      :key="index"
    >
      <component :is="child.tag" :id="child.id" />
    </div>
  </div>
</template>

<script>
import GridGenerator from './GridGenerator'
import nodeMixin from '../../mixins/node'
import childrenMixin from '../../mixins/children'

export default {
  name: 'Layers',
  components: {
    GridGenerator
  },
  mixins: [nodeMixin, childrenMixin]
}
</script>

<style scoped>
.layers {
  position: relative;
  z-index: 0;
  height: 100%;
}
.absolute {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
</style>
