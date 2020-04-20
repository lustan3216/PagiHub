<template>
  <controller-layer
    v-if="firstChild && isDraftMode"
    :class="{ 'dash-border': !isAnimating }"
    :style="innerStyles"
    :id="firstChild.id"
  >
    <async-component
      :tag="firstChild.tag"
      :id="firstChild.id"
    />

    <el-popover
      v-if="mounted && !isExample"
      :reference="parentEl"
      :placement="firstChild.canNewItem ? 'top' : 'right'"
      trigger="hover"
    >
      <node-controller :id="firstChild.id" />
    </el-popover>
  </controller-layer>

  <async-component
    v-else-if="firstChild"
    :tag="firstChild.tag"
    :id="firstChild.id"
  />

  <controller-layer
    v-else-if="isDraftMode && !isExample"
    :class="{ 'dash-border': !isAnimating }"
    :id="id"
    :style="innerStyles"
    class="flex-center"
  >
    <node-controller :id="id" />
  </controller-layer>
</template>

<script>
import childrenMixin from './mixins/children'
import nodeMixin from './mixins/node'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import NodeController from '../TemplateUtils/NodeController'
import AsyncComponent from '../TemplateUtils/AsyncComponent'
import { mapState } from 'vuex'

export default {
  name: 'GridItemChild',
  components: {
    ControllerLayer,
    NodeController,
    AsyncComponent
  },
  mixins: [childrenMixin, nodeMixin],
  data() {
    return {
      mounted: false
    }
  },
  computed: {
    ...mapState('app', ['isAnimating']),
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

<style scoped lang="scss">
.dash-border {
  border: 1px dashed #dedede;
  margin-left: -1px;
  margin-top: -1px;
}
::v-deep.invisible + .vue-resizable-handle {
  display: none;
}
</style>
