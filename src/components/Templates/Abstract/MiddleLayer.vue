<template>
  <div
    :class="{ elevate }"
    class="layer h-100"
    @click.stop="setComponentId"
    @dblclick.stop="dblclick"
    @mouseleave="noClick = true"
  >
    <div
      v-if="isDraftMode && !isExample && isDraggableItem"
      :class="{ 'no-click': noClick, 'no-drag': !noClick }"
      class="h-100"
    >
      <slot />
    </div>
    <slot v-else />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'MiddleLayer',
  inject: { isExample: { default: false }},
  props: {
    id: {
      type: Number
    }
  },
  data() {
    return {
      noClick: true
    }
  },
  computed: {
    ...mapState('nodes', ['currentNodesMap']),
    ...mapGetters('app', ['selectedComponentId']),
    node() {
      return this.currentNodesMap[this.id]
    },
    elevate() {
      return this.selectedComponentId === this.id
    },
    isDraggableItem() {
      return [
        'video-player',
        'form-slider',
        'form-textarea',
        'editor',
        'flex-button',
        'form-submit',
        'form-reset'
      ].includes(this.node.tag)
    }
  },
  methods: {
    ...mapMutations('app', ['SET_SELECTED_COMPONENT_IDS']),
    setComponentId() {
      this.SET_SELECTED_COMPONENT_IDS(+this.id)
    },
    dblclick() {
      this.noClick = false
    }
  }
}
</script>

<style scoped lang="scss">
.layer {
  transition: box-shadow 0.6s, border-color 0.6s;
}
.elevate {
  border-color: #589ff8ad !important;
  box-shadow: 0 3px 20px -9px rgba(0, 0, 0, 0.25) !important;
}
</style>
