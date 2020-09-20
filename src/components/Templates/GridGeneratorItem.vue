<template>
  <div
    :class="{ 'grid-item-border': isDraftMode, 'h-100': !fitContainer }"
    :style="innerStyles.html"
    @scroll.passive="onScroll"
  >
    <component-giver
      v-if="child"
      :id="child.id"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import childrenMixin from './mixins/children'
import nodeMixin from './mixins/node'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import ComponentController from '../TemplateUtils/ComponentController'
import { getValueByPath } from '@/utils/tool'
import { AUTO_HEIGHT, GRID, STYLES } from '@/const'
import { isLayers, isTextEditor } from '@/utils/node'

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
      const fitContainer = getValueByPath(this.child, [
        'innerStyles',
        'layout',
        'fitContainer'
      ])
      return fitContainer && this.canOverflow
    },
    canOverflow() {
      return isTextEditor(this.child) || isLayers(this.child)
    },
    data() {
      return {
        [STYLES]: this.innerStyles,
        [GRID]: this.innerGrid,
        [AUTO_HEIGHT]: this.fitContainer
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
    ...mapActions('layout', ['checkIsGridResizing']),
    onScroll() {
      this.checkIsGridResizing()
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep[data-invisible] + .vue-resizable-handle {
  display: none;
}
</style>
