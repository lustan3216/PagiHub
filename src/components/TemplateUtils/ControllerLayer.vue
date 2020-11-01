<template>
  <div
    v-if="isDraftMode && node"
    :class="{
      'h-100': sameHeightAsParent,
      'no-action': lock,
      'item-editing': itemEditing
    }"
    class="relative z-index1"
    @mousedown="mousedown"
    @mouseup="mouseup"
    @dblclick.stop="dblclick"
    @contextmenu.stop.prevent="contextmenu($event)"
  >
    <portal to="App">
      <context-menu
        v-if="contextMenu.id === id && !gridResizing"
        :style="{
          top: contextMenu.y,
          left: contextMenu.x
        }"
        class="absolute"
        @close="closeContextmenu"
      />

      <component-operator
        v-if="!gridResizing && selected"
        :id="id"
        :key="id"
        :is-example="isExample"
      />
    </portal>

    <div
      v-if="canBeEdited"
      :class="{
        'no-action': !itemEditing && !isExample,
        'h-100': sameHeightAsParent
      }"
    >
      <slot />
    </div>

    <slot v-else />
  </div>

  <div
    v-else-if="node"
    :class="{ 'h-100': sameHeightAsParent }"
    class="relative z-index1"
  >
    <slot />
  </div>
</template>

<script>
import vue from 'vue'
import { mapState, mapMutations } from 'vuex'
import { CAN_BE_EDITED } from '@/const'
import { isMac } from '@/utils/device'
import {
  isBackground,
  isGroup,
  isTextEditor,
  traversalAncestorAndSelf
} from '@/utils/node'
import ContextMenu from '@/components/TemplateUtils/ContextMenu'
import { arrayLast, findIndexBy } from '@/utils/array'

const store = vue.observable({
  lastEditId: null,
  contextMenu: {}
})

export default {
  name: 'ControllerLayer',
  inject: {
    isExample: { default: false }
  },
  components: {
    ContextMenu,
    ComponentOperator: () => import('./ComponentOperator')
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      hovering: false,
      previousX: null,
      previousY: null
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds', 'editingPath', 'isAdding']),
    ...mapState('layout', ['gridResizing']),
    lock() {
      return this.node.lock
    },
    itemEditing() {
      return this.editingPath.includes(this.id)
    },
    node() {
      return this.nodesMap[this.id]
    },
    selected() {
      return this.selectedComponentIds.includes(this.id)
    },
    isLastOne() {
      return arrayLast(this.selectedComponentIds) === this.id
    },
    canBeEdited() {
      return this.node && this.node[CAN_BE_EDITED]
    },
    isTextEditor() {
      return isTextEditor(this.node)
    },
    contextMenu() {
      return store.contextMenu
    },
    isGroup() {
      return isGroup(this.node)
    },
    sameHeightAsParent() {
      return !this.isTextEditor && !this.isGroup
    }
  },
  methods: {
    isMac,
    ...mapMutations('layout', {
      LAYOUT_SET: 'SET'
    }),
    ...mapMutations('app', {
      APP_SET: 'SET'
    }),
    ...mapMutations('app', [
      'SET_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_IN_IDS'
    ]),

    finEditingPath() {
      const editingPath = []
      traversalAncestorAndSelf(this.node, node => {
        editingPath.push(node.id)
      })

      this.APP_SET({ editingPath })
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
    mousedown(event) {
      this.previousX = event.clientX
      this.previousY = event.clientY
    },
    mouseup(event) {
      if (
        this.previousX !== event.clientX &&
        this.previousY !== event.clientY
      ) {
        // moving
        return
      }

      if (this.isAdding) {
        return
      }
      if (!isBackground(this.node)) {
        event.stopPropagation()
      }

      if (this.isRightCheck(event)) {
        return
      }
      this.closeContextmenu()
      // don't change selected component ids when dragging item,
      // otherwise vue-resizable-handle will cause a bug here

      if (!this.isExample) {
        if (this.itemEditing) {
          if (store.lastEditId === this.id) {
            // when clicking text-editor in the editing condition
            // should return to prevent component rerender to lose focus
            return
          }
          const index = findIndexBy(this.editingPath, this.id)
          const editingPath = Array.from(this.editingPath).splice(index)
          this.APP_SET({ editingPath })
        }
        else {
          let editingInChildren = false

          traversalAncestorAndSelf(this.node, parent => {
            editingInChildren = parent.id === store.lastEditId
            if (editingInChildren) {
              return false
            }
          })

          if (!editingInChildren) {
            this.APP_SET({ editingPath: [] })
          }
        }
      }

      if (event.target.classList.contains('vue-resizable-handle')) {
        return
      }

      if (event.shiftKey) {
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

      document.getSelection().removeAllRanges()
    },
    closeContextmenu() {
      store.contextMenu = {}
    },
    contextmenu(event) {
      const y =
        window.innerHeight > event.clientY + 400
          ? event.clientY
          : window.innerHeight - 400
      store.contextMenu = {
        id: this.id,
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
