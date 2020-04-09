<template>
  <div class="layers">
    <template v-for="(child, index) in sortChildren">
      <grid-generator
        v-popover:popover
        :style="{ 'z-index': index }"
        :class="{ absolute: index }"
        :key="child.id"
        :id="child.id"
      />

      <el-popover
        v-if="!isExample && isDraftMode"
        ref="popover"
        :key="`pop${child.id}`"
        placement="top"
        trigger="hover"
      >
        <node-controller :id="child.id" />
      </el-popover>
    </template>
  </div>
</template>

<script>
import GridGenerator from './GridGenerator'
import GridItemChild from '../Abstract/GridItemChild'
import NodeController from '../Abstract/NodeController'
import nodeMixin from '../../mixins/node'
import childrenMixin from '../../mixins/children'
import { SORT_INDEX } from '../../const'

export default {
  name: 'Layers',
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
