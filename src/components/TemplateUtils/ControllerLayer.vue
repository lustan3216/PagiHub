<template>
  <div
    v-if="isDraftMode"
    :class="{ elevate: selected }"
    class="layer h-100"
    @click.exact.stop="SET_SELECTED_COMPONENT_ID(id)"
    @click.ctrl.exact.stop="TOGGLE_SELECTED_COMPONENT_IDS(id)"
    @click.meta.exact.stop="TOGGLE_SELECTED_COMPONENT_IDS(id)"
    @dblclick.stop="dblclick"
  >
    <div
      v-click-outside="coConfig"
      v-if="canDrag || canEditText"
      :class="{ noDrag: !canNotEdit, canNotEdit }"
      class="h-100"
    >
      <slot />
    </div>

    <slot v-else />
  </div>

  <div
    v-else
    class="layer h-100"
  >
    <slot />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import NodeController from './NodeController'
import { shortTagName } from '@/utils/node'
import clickOutside from '@/utils/clickOutside'

export default {
  name: 'ControllerLayer',
  inject: { isExample: { default: false }},
  components: {
    NodeController
  },
  directives: {
    clickOutside
  },
  filters: { shortTagName },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      canNotEdit: true
    }
  },
  computed: {
    ...mapState('draft', ['nodesMap']),
    ...mapState('app', ['selectedComponentIds']),
    node() {
      return this.nodesMap[this.id]
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
    }
  },
  methods: {
    ...mapMutations('app', [
      'SET_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_IDS'
    ]),
    dblclick() {
      this.canNotEdit = false
      this.SET_SELECTED_COMPONENT_ID(this.id)
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
.layer {
  padding-top: 1px;
  margin-top: -1px;
  transition: box-shadow 0.6s, border-color 0.6s;
}
.elevate {
  border-color: #589ff8ad !important;
  box-shadow: 1px 3px 20px -5px rgba(0, 0, 0, 0.25) !important;
}
.canNotEdit {
  pointer-events: none;
}
</style>
