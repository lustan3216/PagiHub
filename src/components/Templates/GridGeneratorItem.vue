<template>
  <div
    :class="{
      'grid-item-border': isDraftMode,
      'border-pulse': parentGridItem.pulsing,
      'h-100': !isTextEditor,
      stack: parentGridItem.pulsing && stack
    }"
  >
    <div
      :style="innerStyles.html"
      class="h-100 border-box"
    >
      <component-giver
        v-if="child"
        :id="child.id"
      />
    </div>
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
    stack() {
      return getValueByPath(this.innerStyles, ['layout', 'stack'])
    },
    isTextEditor() {
      return isTextEditor(this.child)
    },
    data() {
      return {
        [STYLES]: this.innerStyles,
        [GRID]: this.innerGrid,
        [AUTO_HEIGHT]: this.isTextEditor
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

.grid-item-border {
  border: 1px dashed #bcbcbc;
  box-sizing: border-box;
  margin-left: -1px;
}

.stack {
  border-color: #6c717c;
}
.border-pulse {
  animation: border-pulse 1s infinite;
}

@keyframes border-pulse {
  0% {
    border-color: #005aad;
  }
  40% {
    border-color: rgb(0, 154, 255);
  }
  100% {
    border-color: #0065ae;
  }
}
</style>
