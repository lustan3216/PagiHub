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
      :item-editing="itemEditing"
    />

    <slot :item-editing="itemEditing" />
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
import { CAN_BE_EDITED } from '@/const'
import { isMac } from '@/utils/device'

const store = Vue.observable({ currentItemEditingId: null })

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
    // 有些component像是 textedit or video, 裡面有拖拉多種互動，需要用 itemEditing 判定需不需要鎖住，經由點兩下就可操作
    return {
      itemEditing: false
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
    canBeEdited() {
      return this.node && this.node[CAN_BE_EDITED]
    },
    currentItemEditingId() {
      return store.currentItemEditingId
    }
  },
  watch: {
    currentItemEditingId(id) {
      if (this.canBeEdited && this.id !== id) {
        this.itemEditing = false
      }
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
      if (this.canBeEdited) {
        this.itemEditing = true
      }
    },
    singleClick(event) {
      // don't change selected component ids when dragging item,
      // otherwise vue-resizable-handle will cause a bug here
      store.currentItemEditingId = this.id
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
