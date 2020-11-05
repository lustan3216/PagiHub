<template>
  <div
    v-if="isDraftMode && node"
    :class="{
      'h-100': sameHeightAsParent,
      'no-action': lock,
      'item-editing': itemEditing
    }"
    class="relative z-index1"
    @mouseenter="hoveringId = id"
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
        v-if="rect && !isAdding"
        :visible="!gridResizing && (hoveringId === id || selected)"
        :id="id"
        :key="id"
        :rect="rect"
        :is-example="isExample"
        @mousedown="mousedown"
        @mouseup="mouseup"
        @dblclick.stop="dblclick"
        @contextmenu.stop.prevent="contextmenu($event)"
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
  contextMenu: {},
  hoveringId: null
})

export default {
  name: 'EventController',
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
      previousX: null,
      previousY: null,
      rect: null
    }
  },
  computed: {
    ...mapState('app', [
      'selectedComponentIds',
      'editingPath',
      'isAdding',
      'gridResizing'
    ]),
    ...mapState('layout', ['gridResizing', 'windowHeight', 'windowWidth']),
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
    },
    isBackground() {
      return isBackground(this.node)
    },
    hoveringId: {
      get() {
        return store.hoveringId
      },
      set(value) {
        store.hoveringId = value
      }
    }
  },
  watch: {
    gridResizing() {
      this.getRect()
    },
    hoveringId(value) {
      if (value) {
        this.getRect()
      }
    },
    'node.grid': {
      handler() {
        this.getRect()
      },
      deep: true
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
    getRect() {
      if (this.hoveringId === this.id || this.selected) {
        if (this.isBackground) {
          this.rect = this.$el.closest('.art-board').getBoundingClientRect()
        }
        else {
          this.rect = this.$el.getBoundingClientRect()
        }
      }
    },

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
      this.$emit('mousedown', event)
      this.previousX = event.clientX
      this.previousY = event.clientY
    },
    mouseup(event) {
      this.getRect()
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
          // if (store.lastEditId === this.id && !event.shiftKey) {
          //   // when clicking text-editor in the editing condition
          //   // should return to prevent component rerender to lose focus
          //   return
          // }
          // const index = findIndexBy(this.editingPath, this.id)
          // const editingPath = Array.from(this.editingPath).splice(index)
          // this.APP_SET({ editingPath })
          // this.selectedComponent()
          // console.log(editingPath)
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

      if (event.shiftKey) {
        this.TOGGLE_SELECTED_COMPONENT_IN_IDS(this.id)
      }
      else {
        this.SET_SELECTED_COMPONENT_ID(this.id)
        // store.lastEditId = this.id
        setTimeout(() => {
          const element = document.getElementById(`tree-node-${this.id}`)
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'nearest'
            })
          }
        }, 100)
      }

      this.LAYOUT_SET({ gridResizing: false })
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
