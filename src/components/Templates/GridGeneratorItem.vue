<template>
  <div
    :class="{ 'grid-item-border': isDraftMode, 'h-100': !fitContainer }"
    :style="innerStyles.default"
    @scroll.passive="onScroll"
  >
    <component-giver
      v-if="child"
      :id="child.id"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import childrenMixin from './mixins/children'
import nodeMixin from './mixins/node'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import ComponentController from '../TemplateUtils/ComponentController'
import { updateWrapperStyle } from '@/utils/quickFunction'
import { deepMerge, getValueByPath } from '@/utils/tool'
import { deepEqual } from 'vue-observe-visibility/src/utils'
export default {
  name: 'GridGeneratorItem',
  components: {
    ControllerLayer,
    ComponentController,
    ComponentGiver: () => import('../TemplateUtils/ComponentGiver')
  },
  mixins: [childrenMixin, nodeMixin],
  inject: {
    layouts: { required: true }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    child() {
      return this.innerChildren[0]
    },
    fitContainer() {
      return (
        getValueByPath(this.child, 'style.default.overflow') === 'fitContainer'
      )
    }
  },
  watch: {
    masterGrid: {
      handler(grid) {
        const self = this.layouts.find(x => x.id === this.id)

        if (self) {
          deepMerge(self.grid, grid)
        }
      },
      immediate: true,
      deep: true
    },
    innerStyles: {
      handler(style) {
        const self = this.layouts.find(x => x.id === this.id)

        if (self) {
          const autoHeight =
            getValueByPath(style, 'default.overflow') === 'fitContainer'
          this.$set(self, 'autoHeight', autoHeight)
          this.$set(self, 'style', style)
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    onScroll: updateWrapperStyle
  }
}
</script>

<style scoped lang="scss">
::v-deep[data-invisible] + .vue-resizable-handle {
  display: none;
}
</style>
