<template>
  <!-- id here is for selection using, can not delete -->
  <div
    v-if="isDraftMode && node && !isExample"
    @click.stop="singleClick"
    @dblclick.stop="dblclick"
  >
    <node-quick-functions
      v-if="selected"
      :id="id"
      :item-editing="itemEditing"
    />

    <div
      v-click-outside="clickOutside"
      v-if="canBeEdited"
      :class="{ 'grid-item-fix': itemEditing, 'no-action': !itemEditing }"
      class="h-100"
    >
      <slot :item-editing="itemEditing" />
    </div>

    <slot v-else/>
  </div>

  <div v-else-if="node">
    <slot />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import NodeQuickFunctions from './NodeQuickFunctions'
import { CAN_BE_EDITED } from '@/const'
import { isMac } from '@/utils/device'
import clickOutside from '@/utils/clickOutside'

export default {
  name: 'ControllerLayer',
  inject: { isExample: { default: false }},
  components: {
    NodeQuickFunctions
  },
  directives: {
    clickOutside
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    // 有些component像是 textedit or video, 裡面有拖拉多種互動，需要用 itemEditing 判定需不需要鎖住，經由點兩下就可操作
    return {
      itemEditing: false,
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
    }
  },
  methods: {
    isMac,
    ...mapMutations('app', [
      'SET_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_IN_IDS'
    ]),
    clickOutside(event) {
      const inSideBar = document
        .getElementById('sidebar-right')
        .contains(event.target)

      const inComponentTabs = document
        .getElementById('component-tabs')
        .contains(event.target)

      if (!inSideBar && !inComponentTabs) {
        this.itemEditing = false
      }
    },
    dblclick() {
      if (this.canBeEdited) {
        this.itemEditing = true
        this.SET_SELECTED_COMPONENT_ID(this.id)
      }
    },
    singleClick(event) {
      // don't change selected component ids when dragging item,
      // otherwise vue-resizable-handle will cause a bug here

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
