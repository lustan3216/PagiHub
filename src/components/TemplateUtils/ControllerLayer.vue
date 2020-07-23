<template>
  <!-- id here is for selection using, can not delete -->
  <div
    v-if="isDraftMode && node"
    :id="id"
    :class="{ selected, 'dash-border': !isAnimating && border }"
    class="control-layer h-100"
    @click.exact.stop="
      canNotEdit && !isExample && SET_SELECTED_COMPONENT_ID(id)
    "
    @click.ctrl.exact.stop="!isExample && TOGGLE_SELECTED_COMPONENT_IN_IDS(id)"
    @click.meta.exact.stop="!isExample && TOGGLE_SELECTED_COMPONENT_IN_IDS(id)"
    @dblclick.stop="dblclick"
  >
    <portal-target
      :name="`ControllerLayerTutorial${id}`"
      class="tutorial"
    />

    <div
      v-click-outside="coConfig"
      v-if="canDrag || canEditText"
      :class="{ noDrag: !canNotEdit, 'can-not-edit': canNotEdit }"
      class="h-100"
    >
      <slot />
    </div>

    <div
      v-else
      class="h-100 pointer"
    >
      <slot />
    </div>
  </div>

  <div
    v-else-if="node"
    class="control-layer h-100"
  >
    <slot />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import NodeController from './NodeController'
import clickOutside from '@/utils/clickOutside'
import { CAN_DRAG, CAN_EDIT, GRID_ITEM } from '@/const'
import { isMac } from '@/utils/device'

const controllerVmMap = {}
if (process.env.NODE_ENV !== 'production') {
  window.controller = controllerVmMap
}

export default {
  name: 'ControllerLayer',
  inject: { isExample: { default: false }},
  components: {
    NodeController
  },
  directives: {
    clickOutside
  },
  props: {
    id: {
      type: String,
      required: true
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      canNotEdit: true
    }
  },
  computed: {
    ...mapState('app', ['isAnimating', 'selectedComponentIds']),
    ...mapState('example', ['basicExamplesMap']),
    node() {
      if (this.isExample) {
        return this.basicExamplesMap[this.id]
      } else {
        return this.componentsMap[this.id]
      }
    },
    selected() {
      return this.selectedComponentIds.includes(this.id)
    },
    canEditText() {
      return this.node && this.node.canEditText
    },
    canDrag() {
      return this.node && this.node.canDrag
    },
    coConfig() {
      return !this.canNotEdit && this.clickOutside
    },
    isGridItem() {
      return this.node.tag === GRID_ITEM
    }
  },
  created() {
    if (this.isDraftMode && !this.isExample) {
      controllerVmMap[this.id] = this
    }
  },
  beforeDestroy() {
    if (this.isDraftMode && !this.isExample) {
      delete controllerVmMap[this.id]
    }
  },
  methods: {
    isMac,
    ...mapMutations('app', [
      'SET_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_IN_IDS'
    ]),
    dblclick() {
      if (this.node[CAN_DRAG] || this.node[CAN_EDIT]) {
        this.canNotEdit = false
        this.SET_SELECTED_COMPONENT_ID(this.id)
      }
    },
    clickOutside(event) {
      const inSideBar = document
        .querySelector('.sidebar-right')
        .contains(event.target)

      if (!inSideBar) {
        this.canNotEdit = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
.control-layer {
  transition: box-shadow 0.6s, border-color 0.6s;
}
.selected {
  border-color: rgba(81, 117, 199, 0.68) !important;
}
::v-deep.can-not-edit {
  pointer-events: none;

  & > .swiper-container {
    cursor: unset !important;
  }
}
.dash-border {
  border: 1px dashed #dedede;
  box-sizing: border-box;
}
.tutorial {
  position: absolute;
  top: -18px;
  right: -18px;
}
</style>
