<template>
  <div
    v-if="isDraftMode && node"
    :class="{ 'h-100': !isTextEditor, 'no-action': lock }"
    @mousedown.stop="singleClick"
    @dblclick.stop="dblclick"
    @contextmenu.stop.prevent="contextmenu($event)"
  >
    <portal to="App">
      <context-menu
        v-if="contextMenu && selected && !gridResizing"
        :style="{
          top: contextMenu.y,
          left: contextMenu.x
        }"
        class="absolute"
        @close="closeContextmenu"
      />
    </portal>

    <portal :to="`App-${id}`">
      <component-quick-functions
        v-if="selected && !gridResizing"
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
        'no-action': !itemEditing && !isExample,
        'h-100': !isTextEditor
      }"
    >
      <slot :item-editing="itemEditing" />
    </div>

    <slot v-else />
  </div>

  <div
    v-else-if="node"
    :class="{ 'h-100': !isTextEditor }"
  >
    <slot />
  </div>
</template>

<script>
import vue from 'vue'
import { mapState, mapMutations } from 'vuex'
import { CAN_BE_EDITED, STYLES } from '@/const'
import { isMac } from '@/utils/device'
import { getNode, isTextEditor, traversalAncestorAndSelf } from '@/utils/node'
import { getValueByPath, isUndefined } from '@/utils/tool'
import { isInstance } from '@/utils/inheritance'
import { inheritanceObject } from '@/components/TemplateUtils/InheritanceController'
import ContextMenu from '@/components/TemplateUtils/ContextMenu'
import { findIndexBy } from '@/utils/array'
import { vmGet } from '@/utils/vmMap'

const store = vue.observable({ editingPath: [], lastEditId: null, contextMenu: null })

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
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapState('layout', ['gridResizing']),
    ...mapState('example', ['exampleNodesMap']),
    lock() {
      return this.node.lock
    },
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
    isTextEditor() {
      return isTextEditor(this.child)
    },
    contextMenu() {
      return store.contextMenu
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

    finEditingPath() {
      const path = []
      traversalAncestorAndSelf(this.node, node => {
        path.push(node.id)
      })

      store.editingPath = path
      store.lastEditId = this.node.id
    },

    dblclick() {
      if (this.canBeEdited) {
        if (!this.isExample) {
          this.finEditingPath()
        }

        this.SET_SELECTED_COMPONENT_ID(this.id)
      }
    },

    singleClick(event) {
      if (this.isRightCheck(event)) {
        return
      }
      this.closeContextmenu()
      // don't change selected component ids when dragging item,
      // otherwise vue-resizable-handle will cause a bug here

      if (!this.isExample) {
        if (this.itemEditing) {
          const index = findIndexBy(store.editingPath, this.id)
          store.editingPath.splice(0, index)
        }
        else {
          let editingWithinChildren = false

          traversalAncestorAndSelf(this.node, parent => {
            editingWithinChildren = parent.id === store.lastEditId
            if (editingWithinChildren) {
              return false
            }
          })

          if (!editingWithinChildren) {
            store.editingPath = []
          }
        }
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
        setTimeout(() => {
          const element = document.getElementById(`tree-node-${this.id}`)
          if (element) {
            element.scrollIntoView(false)
          }
        }, 100)
      }
    },
    closeContextmenu() {
      store.contextMenu = null
    },
    contextmenu(event) {
      const y = window.innerHeight > event.clientY + 400 ? event.clientY : window.innerHeight - 400
      store.contextMenu = {
        x: `${event.clientX + 10}px`,
        y: `${y}px`
      }
    },
    isRightCheck(e) {
      e = e || window.event
      if ('which' in e) {
        return e.which === 3
      }
      else if ('button' in e) {
        return e.button === 2
      }
    }
  }
}
</script>
