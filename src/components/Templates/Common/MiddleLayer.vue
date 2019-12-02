<template>
  <div
    :class="{ elevate }"
    class="layer h-100"
    @click.stop="click"
    @mouseleave="noClick = true"
    @mouseover.stop="setCurrentKey"
  >
    <div
      v-if="isEditable && isDraggableItem"
      :class="{ 'no-click': noClick, 'no-drag': !noClick }"
      class="h-100"
    >
      <slot />
    </div>
    <slot v-else />
  </div>
</template>

<script>
import globalStatus from '../../../observable/globalStatus'
import { mapState } from 'vuex'
export default {
  name: 'MiddleLayer',
  inject: ['isEditable'],
  props: {
    id: {
      type: Number
    },
    isEditable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      noClick: true
    }
  },
  computed: {
    ...mapState('nodes', ['currentNodesMap']),
    node() {
      return this.currentNodesMap[this.id]
    },
    elevate() {
      return globalStatus.elevateId === this.id
    },
    isDraggableItem() {
      return ['video-player', 'form-item', 'editor'].includes(this.node.tag)
    }
  },
  methods: {
    setCurrentKey() {
      globalStatus.elevateId = this.id
    },
    click() {
      this.noClick = false
      globalStatus.settingId = this.id
    }
  }
}
</script>

<style scoped lang="scss">
.layer {
  transition: box-shadow 0.6s, border-color 0.6s;
}
</style>
