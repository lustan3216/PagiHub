<template>
  <lazy-load>
    <controller-layer
      v-if="firstChild"
      :id="firstChild.id"
    >
      <async-component
        :tag="firstChild.tag"
        :id="firstChild.id"
      />

      <el-popover
        v-if="mounted && !isExample && isDraftMode"
        :reference="parentEl"
        :placement="firstChild.canNewItem ? 'top' : 'right'"
        trigger="hover"
      >
        <node-controller :id="firstChild.id" />
      </el-popover>
    </controller-layer>

    <controller-layer
      v-else-if="isDraftMode && !isExample"
      :id="id"
      class="flex-center pointer"
    >
      <node-controller :id="id" />
    </controller-layer>
  </lazy-load>
</template>

<script>
import childrenMixin from '../../mixins/children'
import nodeMixin from '../../mixins/node'
import ControllerLayer from './ControllerLayer'
import NodeController from './NodeController'
import AsyncComponent from './AsyncComponent'
import LazyLoad from './LazyLoad'

export default {
  name: 'GridItemChild',
  components: {
    ControllerLayer,
    NodeController,
    AsyncComponent,
    LazyLoad
  },
  mixins: [childrenMixin, nodeMixin],
  data() {
    return {
      mounted: false
    }
  },
  computed: {
    firstChild() {
      return this.innerChildren[0]
    },
    parentEl() {
      return (
        this.$parent &&
        this.$parent.$el &&
        this.$parent.$el.setAttribute &&
        this.$parent.$el
      )
    }
  },
  mounted() {
    this.mounted = true
  }
}
</script>
