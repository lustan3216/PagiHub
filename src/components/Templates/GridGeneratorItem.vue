<template>
  <div
    :class="{
      'grid-item-border': isDraftMode,
      'border-pulse': parentGridItem.pulsing,
      'h-100': !fitContainer,
      stack: parentGridItem.pulsing && stack
    }"
    :style="innerStyles.html"
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
import { getValueByPath } from '@/utils/tool'
import { AUTO_HEIGHT, GRID, STYLES } from '@/const'
import { isTextEditor } from '@/utils/node'

export default {
  name: 'GridGeneratorItem',
  components: {
    ControllerLayer,
    ComponentController,
    ComponentGiver: () => import('../TemplateUtils/ComponentGiver')
  },
  mixins: [childrenMixin, nodeMixin],
  inject: {
    // connect with GridGeneratorInner
    gridItemsData: { required: true }
  },
  provide() {
    return {
      parentGridItem: this.parentGridItem
    }
  },
  data() {
    return {
      parentGridItem: {
        pulsing: false
      }
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    child() {
      return this.innerChildren[0]
    },
    fitContainer() {
      return (
        getValueByPath(this.innerStyles, ['layout', 'autoHeight']) &&
        this.canOverflow
      )
    },
    stack() {
      return getValueByPath(this.innerStyles, ['layout', 'stack'])
    },
    canOverflow() {
      return isTextEditor(this.child)
    },
    data() {
      return {
        [STYLES]: this.innerStyles,
        [GRID]: this.innerGrid,
        [AUTO_HEIGHT]: this.autoHeight
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
  }
}
</script>

<style scoped lang="scss">
::v-deep[data-invisible] + .vue-resizable-handle {
  display: none;
}

.stack {
  border-color: #aeb4c2;
}
.border-pulse {
  border-color: #9499a5;
  animation: border-pulse 1s infinite;
}
@keyframes border-pulse {
  0% {
    border-color: #9499a5;
  }
  50% {
    border-color: #50535b;
  }
  100% {
    border-color: #9499a5;
  }
}
</style>
