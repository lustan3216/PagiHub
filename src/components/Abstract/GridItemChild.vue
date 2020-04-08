<template>
  <controller-layer v-if="firstChild" :id="firstChild.id">
    <component :is="firstChild.tag" :id="firstChild.id" />

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
</template>

<script>
import importTemplates from '../../mixins/importTemplates'
import childrenMixin from '../../mixins/children'
import nodeMixin from '../../mixins/node'
import ControllerLayer from './ControllerLayer'
import NodeController from './NodeController'

export default {
  name: 'GridItemChild',
  components: {
    ControllerLayer,
    NodeController
  },
  mixins: [importTemplates, childrenMixin, nodeMixin],
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
