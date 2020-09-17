<template>
  <!-- id here is for selection using, can not delete -->
  <div
    v-if="isDraftMode && node"
    :class="{ 'h-100': !fitContainer }"
    @mousedown.stop="contextMenu = null"
    @mouseup.stop="singleClick"
    @dblclick.stop="dblclick"
    @contextmenu="contextmenu($event)"
  >
    <portal
      v-if="selected && !gridResizing"
      to="App"
    >
      <context-menu
        v-if="contextMenu"
        :style="{
          top: contextMenu.y,
          left: contextMenu.x
        }"
        :id="id"
        class="absolute"
        menu-only
      />
    </portal>

    <portal
      v-if="selected && !gridResizing"
      :to="`App-${id}`"
    >
      <component-quick-functions
        :id="id"
        :is-example="isExample"
        :item-editing="itemEditing"
        :inherit-parent-id="inheritance.inheritParentId"
        :master-component-set-id="inheritance.masterComponentSetId"
      />
    </portal>

    <portal
      v-if="selected && onlyOneSelected && isInstance"
      to="PanelStyles"
    >
      <setting-inheritance
        :id="id"
        :item-editing="itemEditing"
        :inherit-parent-id="inheritance.inheritParentId"
        :master-component-set-id="inheritance.masterComponentSetId"
      />
    </portal>

    <div
      v-if="canBeEdited"
      :class="{
        'grid-item-fix': itemEditing,
        'no-action': !itemEditing,
        'h-100': !fitContainer
      }"
    >
      <slot :item-editing="itemEditing" />
    </div>

    <slot v-else />
  </div>

  <div
    v-else-if="node"
    :class="{ 'h-100': !fitContainer }"
  >
    <slot />
  </div>
</template>

<script>
import vue from 'vue'
import { mapState, mapMutations, mapActions } from 'vuex'
import { CAN_BE_EDITED, STYLES } from '@/const'
import { isMac } from '@/utils/device'
import {
  getNode,
  isLayers,
  isTextEditor,
  traversalAncestorAndSelf
} from '@/utils/node'
import { getValueByPath, isUndefined } from '@/utils/tool'
import { isInstance } from '@/utils/inheritance'
import { inheritanceObject } from '@/components/TemplateUtils/InheritanceController'
import ContextMenu from '@/components/TemplateUtils/ContextMenu'
import { findIndexBy } from '@/utils/array'

const store = vue.observable({ editingPath: [] })

export default {
  name: 'ControllerLayer',
  inject: {
    isExample: { default: false },
    inheritance: {
      default: inheritanceObject()
    }
  },
  components: {
    ContextMenu,
    ComponentQuickFunctions: () => import('./ComponentQuickFunctions'),
    SettingInheritance: () =>
      import('@/components/Setup/EditorSetting/SettingInheritance')
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    // 有些component像是 text edit or video, 裡面有拖拉多種互動，需要用 itemEditing 判定需不需要鎖住，經由點兩下就可操作
    return {
      contextMenu: null
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapState('layout', ['gridResizing']),
    ...mapState('example', ['exampleNodesMap']),
    itemEditing() {
      return store.editingPath.includes(this.id)
    },
    node() {
      return getNode(this.id)
    },
    onlyOneSelected() {
      return this.selectedComponentIds.length === 1
    },
    selected() {
      return this.selectedComponentIds.includes(this.id)
    },
    isInstance() {
      return isInstance(this.node)
    },
    canBeEdited() {
      return this.node && this.node[CAN_BE_EDITED]
    },
    child() {
      return getValueByPath(this.node, ['children', 0])
    },
    fitContainer() {
      const overflow = getValueByPath(this.child, [
        STYLES,
        'default',
        'overflow'
      ])
      return isUndefined(overflow) && this.canOverflow
    },
    canOverflow() {
      return isTextEditor(this.child) || isLayers(this.child)
    }
  },
  methods: {
    isMac,
    ...mapMutations('layout', {
      LAYOUT_SET: 'SET'
    }),
    ...mapMutations('app', [
      'SET_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_IN_IDS'
    ]),
    ...mapActions('layout', ['resizeNodeQuickFn']),

    finEditingPath() {
      const path = []
      traversalAncestorAndSelf(this.node, node => {
        path.push(node.id)
      })
      store.editingPath = path
    },

    dblclick() {
      if (!this.isExample) {
        this.finEditingPath()
      }
      if (this.canBeEdited) {
        this.SET_SELECTED_COMPONENT_ID(this.id)
      }
    },

    singleClick(event) {
      // don't change selected component ids when dragging item,
      // otherwise vue-resizable-handle will cause a bug here

      if (!this.isExample && this.itemEditing) {
        const index = findIndexBy(store.editingPath, this.id)
        store.editingPath.splice(0, index)
      }

      if (event.target.classList.contains('vue-resizable-handle')) {
        return
      }

      if (event.metaKey || event.ctrlKey) {
        this.TOGGLE_SELECTED_COMPONENT_IN_IDS(this.id)
      }
      else {
        this.LAYOUT_SET({ gridResizing: false })
        this.SET_SELECTED_COMPONENT_ID(this.id)
        this.resizeNodeQuickFn()
        setTimeout(() => {
          document.getElementById(`tree-node-${this.id}`).scrollIntoView(false)
        }, 100)
      }
    },
    contextmenu(event) {
      event.preventDefault()
      event.stopPropagation()
      this.contextMenu = {
        x: `${event.clientX}px`,
        y: `${event.clientY}px`
      }
    }
  }
}
</script>
