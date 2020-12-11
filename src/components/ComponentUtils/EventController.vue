<template>
  <div
    v-if="node"
    :class="{
      'h-100': !autoResizeHeight,
      'no-action': lock
    }"
    class="relative z-index1"
    @mouseenter="hoveringId = id"
    @mousedown="$emit('mousedown', $event)"
    @mouseup="mouseup"
    @dblclick.stop="dblclick"
    @contextmenu.stop.prevent="contextmenu($event)"
  >

    <portal :to="rectCoverTo">
      <component
        v-if="rect && !isAdding"
        :hovered="hoveringId === id"
        :is="whichRectCover"
        :id="id"
        :key="id"
        :rect="rect"
        @move-start="moveStart"
        @resize-start="resizeStart"
        @mouseenter.native="hoveringId = id"
        @mouseup.native.stop="mouseup"
        @mousedown.native="$emit('mousedown', $event)"
        @dblclick.native.stop="dblclick"
        @contextmenu.native.stop.prevent="contextmenu($event)"
      />
    </portal>

    <portal
      :disabled="gridResizing"
      to="App"
    >
      <context-menu
        v-if="contextMenu.id === id && !gridResizing"
        :style="{
          top: contextMenu.y,
          left: contextMenu.x
        }"
        class="absolute"
        @close="closeContextmenu"
      />
    </portal>

    <div
      v-if="canBeEdited"
      :class="{
        'no-action': !itemEditing && !isExample,
        'h-100': !autoResizeHeight
      }"
    >
      <slot />
    </div>

    <slot v-else />
  </div>
</template>

<script>
import vue from 'vue'
import { mapState, mapMutations } from 'vuex'
import { CAN_BE_EDITED } from '@/const'
import {
  isBackground,
  isGroup, isSlider,
  isTextEditor, traversalAncestor,
  traversalAncestorAndSelf
} from '@/utils/node'
import ContextMenu from '@/components/ComponentUtils/ContextMenu'
import { arrayLast, findIndexBy } from '@/utils/array'
import { globalDebounce } from '@/utils/tool'

const store = vue.observable({
  lastEditId: null,
  contextMenu: {},
  hoveringId: null,
  resizingId: null,
  movingId: null
})

export default {
  name: 'EventController',
  inject: {
    isExample: { default: false },
    boundaryRect: { required: true }
  },
  components: {
    ContextMenu,
    RectCoverExample: () => import('./RectCoverExample'),
    RectCoverComponent: () => import('./RectCoverComponent')
  },
  props: {
    id: {
      type: String,
      required: true
    },
    element: {
      type: HTMLDivElement,
      required: true
    }
  },
  computed: {
    ...mapState('app', [
      'selectedComponentIds',
      'editingPath',
      'isAdding'
    ]),
    ...mapState('layout', ['gridResizing', 'scaleRatio', 'scrolling']),
    whichRectCover() {
      return this.isExample ? 'RectCoverExample' : 'RectCoverComponent'
    },
    lock() {
      return this.node.lock
    },
    rectCoverTo() {
      if (isBackground(this.node)) {
        return 'ArtBoard'
      }
      if (isSlider(this.node)) {
        return 'GridInner-' + this.node.id
      }
      let to = ''

      traversalAncestor(this.node, node => {
        if (isBackground(node) || isGroup(node) || isSlider(node)) {
          to = 'GridInner-' + node.id
          return false
        }
      })

      return to
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
    autoResizeHeight() {
      return this.isTextEditor || this.isGroup
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
    },
    rect() {
      return this.boundaryRect.px
    }
  },
  watch: {
    'node.styles': {
      handler() {
        this.LAYOUT_SET({ gridResizing: true })

        globalDebounce(() => {
          this.LAYOUT_SET({ gridResizing: false })
        }, 1500)
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('layout', { LAYOUT_SET: 'SET' }),
    ...mapMutations('app', { APP_SET: 'SET' }),
    ...mapMutations('app', [
      'SET_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_IN_IDS',
      'PUSH_SELECTED_COMPONENT_ID'
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
        this.finEditingPath()
        this.SET_SELECTED_COMPONENT_ID(this.id)
      }
    },
    moveStart() {
      this.LAYOUT_SET({ gridResizing: true })
      store.movingId = this.id
    },
    resizeStart() {
      store.resizingId = this.id
    },
    mouseup(event) {
      this.$emit('mouseup', event)

      this.hoveringId = null

      if (store.resizingId) {
        store.resizingId = null
        return
      }

      setTimeout(() => {
        this.LAYOUT_SET({ gridResizing: false })
      }, 220)

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
          if (store.lastEditId === this.id && !event.shiftKey) {
            // when clicking text-editor in the editing condition
            // should return to prevent component rerender to lose focus
            this.SET_SELECTED_COMPONENT_ID(this.id)
            return
          }
          const index = findIndexBy(this.editingPath, this.id)
          const editingPath = Array.from(this.editingPath).splice(index)
          this.APP_SET({ editingPath })
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

      if (store.movingId) {
        store.movingId = null
        if (!this.selected) {
          this.SET_SELECTED_COMPONENT_ID(this.id)
        }
      }
      else if (event.shiftKey) {
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

      document.getSelection().removeAllRanges()
    },
    closeContextmenu() {
      store.contextMenu = {}
    },
    contextmenu(event) {
      if (this.isExample || !this.isDraftMode) return

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
