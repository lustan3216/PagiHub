<template>
  <div
    :class="{ elevate }"
    class="layer h-100"
    @click.stop="setComponentId"
    @dblclick.stop="dblclick"
    @mouseleave="noClick = true"
  >
    <div
      v-if="node && isDraftMode && !isExample && isDraggableItem"
      class="h-100"
    >
      <slot />
    </div>

    <slot v-else />

    <el-popover
      v-if="$parent.$el && !isExample"
      :reference="$parent.$el"
      :placement="node.canNewItem ? 'top' : 'right'"
      trigger="hover"
    >
      <span class="m-r-10">{{ node.tag | shortTagName }}</span>
      <node-controller :id="id" />
    </el-popover>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import NodeController from '../../Layout/Controller/NodeController'
import { shortTagName } from '../../../utils/node'

export default {
  name: 'ControllerLayer',
  inject: { isExample: { default: false }},
  components: {
    NodeController
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
      noClick: true
    }
  },
  computed: {
    ...mapState('draft', ['nodesMap']),
    ...mapState('app', ['selectedComponentIds']),
    node() {
      return this.nodesMap[this.id]
    },
    elevate() {
      return this.selectedComponentIds.includes(this.id)
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
    ...mapMutations('app', ['TOGGLE_SELECTED_COMPONENT_IDS']),
    setComponentId() {
      this.TOGGLE_SELECTED_COMPONENT_IDS(+this.id)
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
  box-shadow: 1px 3px 20px -5px rgba(0, 0, 0, 0.25) !important;
}
</style>
