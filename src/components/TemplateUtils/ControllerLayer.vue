<template>
  <!-- id here is for selection using, can not delete -->
  <div
    v-if="isDraftMode && node"
    :class="{ selected, 'dash-border': border }"
    class="h-100"
    @click.stop="singleClick"
    @dblclick.stop="dblclick"
  >
    <node-quick-functions
      v-if="selected"
      :id="id"
    />

    <slot :can-not-edit="!canOperate" />
  </div>

  <div
    v-else-if="node"
    class="h-100"
  >
    <slot />
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapMutations } from 'vuex'
import NodeQuickFunctions from './NodeQuickFunctions'
import { CAN_DRAG, CAN_EDIT } from '@/const'
import { isMac } from '@/utils/device'

const store = Vue.observable({ currentCancanOperateId: null })

export default {
  name: 'ControllerLayer',
  inject: { isExample: { default: false }},
  components: {
    NodeQuickFunctions
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
      canOperate: true
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
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
    canEdit() {
      return this.node && (this.node[CAN_DRAG] || this.node[CAN_EDIT])
    },
    currentCancanOperateId() {
      return store.currentCancanOperateId
    }
  },
  watch: {
    currentCancanOperateId(id) {
      if (this.canEdit && this.id !== id) {
        this.canOperate = false
      }
    }
  },
  created() {
    if (this.canEdit) {
      this.canOperate = false
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
      if (this.canEdit) {
        this.canOperate = true
      }
    },
    singleClick(event) {
      // don't change selected component ids when dragging item,
      // otherwise vue-resizable-handle will cause a bug here
      store.currentCancanOperateId = this.id
      if (
        this.isExample ||
        event.target.classList.contains('vue-resizable-handle')
      ) {
        return
      }

      if (event.metaKey || event.ctrlKey) {
        this.TOGGLE_SELECTED_COMPONENT_IN_IDS(this.id)
      } else {
        this.SET_SELECTED_COMPONENT_ID(this.id)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.dash-border {
  border: 1px dashed #dedede;
  margin: -1px;
}
</style>
