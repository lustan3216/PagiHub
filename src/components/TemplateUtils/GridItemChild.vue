<template>
  <div
    :class="{ 'dash-border': isDraftMode && !isAnimating }"
    class="h-100"
  >
    <template v-if="firstChild">
      <template v-if="isDraftMode">
        <portal-target :name="`GridItemChild${firstChild.id}`" />

        <controller-layer
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
      </template>

      <async-component
        v-else
        :tag="firstChild.tag"
        :id="firstChild.id"
      />
    </template>

    <controller-layer
      v-else-if="isDraftMode && !isExample"
      :id="id"
      :style="innerStyles"
      class="flex-center"
    >
      <node-controller :id="id" />
    </controller-layer>
  </div>
</template>

<script>
import childrenMixin from '../Templates/mixins/children'
import nodeMixin from '../Templates/mixins/node'
import ControllerLayer from './ControllerLayer'
import NodeController from './NodeController'
import AsyncComponent from './AsyncComponent'
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
