<template>
  <div class="layer">
    <template v-for="(child, index) in innerChildren">
      <component
        :is="child.tag"
        :key="child.id"
        :id="child.id"
        :style="{ 'z-index': index, ...innerStyles }"
        :class="{ absolute: index }"
      />
    </template>
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
