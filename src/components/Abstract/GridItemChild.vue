<template>
  <lazy-load :class="{ 'dash-border': isDraftMode && !isAnimating }">
    <template v-if="firstChild">
      <portal-target
        v-if="isDraftMode"
        :name="`GridItemChild${firstChild.id}`"
      />
      <controller-layer
        :style="innerStyles"
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
    </template>

    <controller-layer
      v-else-if="isDraftMode && !isExample"
      :id="id"
      :style="innerStyles"
      class="flex-center"
    >
      <node-controller :id="id" />
    </controller-layer>
  </lazy-load>
</template>

<script>
import childrenMixin from '../Templates/mixins/children'
import nodeMixin from '../Templates/mixins/node'
import ControllerLayer from './ControllerLayer'
import NodeController from './NodeController'
import AsyncComponent from './AsyncComponent'
import LazyLoad from './LazyLoad'
import { mapState } from 'vuex'

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
