<template>
  <!-- id here is for selection using, can not delete -->
  <div
    v-if="isDraftMode && node"
    :class="{ 'h-100': !fitContainer }"
    @mouseup.stop="singleClick"
    @dblclick.stop="dblclick"
  >
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
      v-click-outside="clickOutside"
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
import { mapState, mapMutations, mapActions } from 'vuex'
import { CAN_BE_EDITED, STYLES } from '@/const'
import { isMac } from '@/utils/device'
import { getNode, isLayers, isTextEditor } from '@/utils/node'
import { getValueByPath, isUndefined } from '@/utils/tool'
import clickOutside from '@/utils/clickOutside'
import { isInstance } from '@/utils/inheritance'
import { inheritanceObject } from '@/components/TemplateUtils/InheritanceController'

export default {
  name: 'ControllerLayer',
  inject: {
    isExample: { default: false },
    inheritance: {
      default: inheritanceObject()
    }
  },
  directives: {
    clickOutside
  },
  components: {
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
      itemEditing: false
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds', 'gridResizing']),
    ...mapState('example', ['exampleNodesMap']),
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
      return this.node.children[0]
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
    ...mapMutations('app', {
      APP_SET: 'SET'
    }),
    ...mapMutations('app', [
      'SET_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_IN_IDS'
    ]),
    ...mapActions('app', ['resizeNodeQuickFn']),
    clickOutside(event) {
      const insideArea = [
        '#sidebar-right',
        '#examples-dialog',
        '#component-tabs',
        '#menu-bubble',
        '.el-select-dropdown__item',
        '.el-tooltip__popper',
        '.el-color-dropdown'
      ]
      let clickInside = false

      loop1: for (let i = 0; i < event.path.length; i++) {
        const element = event.path[i]

        if (['HTML', 'BODY'].includes(element.tagName)) {
          break loop1
        }
        else if (element.id === 'art-board') {
          clickInside = false
          break loop1
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
        this.APP_SET({ gridResizing: false })
        this.SET_SELECTED_COMPONENT_ID(this.id)
        this.resizeNodeQuickFn()
        setTimeout(() => {
          document.getElementById(`tree-node-${this.id}`).scrollIntoView(false)
        }, 100)
      }
    }
  }
}
</script>
