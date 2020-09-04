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
import { getValueByPath } from '@/utils/tool'

export default {
  name: 'GridGeneratorItem',
  components: {
    ControllerLayer,
    ComponentController,
    ComponentGiver: () => import('../TemplateUtils/ComponentGiver')
  },
  mixins: [childrenMixin, nodeMixin],
  inject: {
    gridItemsData: { required: true }
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
    },
    data() {
      return {
        style: this.innerStyles,
        grid: this.innerGrid,
        autoHeight: this.fitContainer
      }
    }
  },
  watch: {
    data: {
      handler(value) {
        this.$set(this.gridItemsData, this.id, value)
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
