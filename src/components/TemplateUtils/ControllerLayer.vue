<template>
  <!-- id here is for selection using, can not delete -->
  <div
    v-if="isDraftMode && node"
    @click.stop="singleClick"
    @dblclick.stop="dblclick"
  >
    <portal
      v-if="selected && !isArtBoardResizing"
      :to="`QuickFunction${id}`"
    >
      <node-quick-functions
        :id="id"
        :is-example="isExample"
        :item-editing="itemEditing"
      />
    </portal>

    <div
      v-click-outside="clickOutside"
      v-if="canBeEdited"
      :class="{
        'grid-item-fix': itemEditing,
        'no-action': !itemEditing
      }"
      class="h-100"
    >
      <slot :item-editing="itemEditing" />
    </div>

    <slot v-else />
  </div>

  <div v-else-if="node">
    <slot />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { CAN_BE_EDITED } from '@/const'
import { isMac } from '@/utils/device'
import { getNode } from '@/utils/node'
import clickOutside from '@/utils/clickOutside'
import NodeQuickFunctions from './NodeQuickFunctions'

export default {
  name: 'ControllerLayer',
  inject: { isExample: { default: false }},
  directives: {
    clickOutside
  },
  components: {
    NodeQuickFunctions
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
      itemEditing: false
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds', 'isArtBoardResizing']),
    ...mapState('example', ['exampleComponentsMap']),
    node() {
      return getNode(this.id)
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
    isTextEditor() {
      return this.node.tag === 'text-editor'
    },
    clickOutside(event) {
      const insideArea = [
        '#sidebar-right',
        '.el-select-dropdown__item',
        '#component-tabs',
        '#menu-bubble',
        '.el-tooltip__popper',
        '.el-color-dropdown'
      ]
      let clickInside = false

      loop1: for (let i = 0; i < event.path.length; i++) {
        const element = event.path[i]

        if (element.id === 'art-board' || element.tagName === 'BODY') {
          clickInside = false
          break
        }
        for (let ii = 0; ii < insideArea.length; ii++) {
          const areaSelector = insideArea[ii]

          if (areaSelector[0] === '.') {
            if (element.classList.contains(areaSelector.replace('.', ''))) {
              clickInside = true
              break loop1
            }
          }
          else if (areaSelector[0] === '#') {
            if (element.id === areaSelector.replace('#', '')) {
              clickInside = true
              break loop1
            }
          }
        }
      }

      if (!clickInside) {
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

      if (event.target.classList.contains('vue-resizable-handle')) {
        return
      }

      if (event.metaKey || event.ctrlKey) {
        this.TOGGLE_SELECTED_COMPONENT_IN_IDS(this.id)
      }
      else {
        this.SET_SELECTED_COMPONENT_ID(this.id)
      }
    }
  }
}
</script>
