<template>
  <div
    :class="{ 'grid-item-border': isDraftMode, 'h-100': !fitContainer }"
    :style="innerStyles.default"
    @scroll.passive="onScroll"
  >
    <async-component
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
import AsyncComponent from '../TemplateUtils/AsyncComponent'
import { updateWrapperStyle } from '@/utils/quickFunction'
import { getValueByPath } from '@/utils/tool'

export default {
  name: 'GridGeneratorItem',
  components: {
    ControllerLayer,
    ComponentController,
    AsyncComponent
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
