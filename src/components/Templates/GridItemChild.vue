<template>
  <div
    :style="innerStyles.default"
    class="h-100"
  >
    <controller-layer
      v-if="firstChild"
      :id="firstChild.id"
      class="border-box"
    >
      <async-component
        :tag="firstChild.tag"
        :id="firstChild.id"
      />

      <template v-if="isDraftMode">
        <el-popover
          v-if="mounted && !isExample && !isAnimating"
          :reference="parentEl"
          :placement="firstChild.canNewItem ? 'top' : 'right'"
          trigger="hover"
        >
          <node-controller :id="firstChild.id" />
        </el-popover>

        <portal-target :name="`GridItemChild${firstChild.id}`" />
      </template>
    </controller-layer>

    <controller-layer
      v-else
      :id="id"
      class="flex-center border-box"
    >
      <template v-if="isDraftMode">
        <portal-target :name="`GridItemChild${id}`" />
        <node-controller
          v-if="!isExample"
          :id="id"
          class="h-100"
        />
      </template>
    </controller-layer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import childrenMixin from './mixins/children'
import nodeMixin from './mixins/node'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import NodeController from '../TemplateUtils/NodeController'
import AsyncComponent from '../TemplateUtils/AsyncComponent'

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
::v-deep[data-invisible] + .vue-resizable-handle {
  display: none;
}
</style>
