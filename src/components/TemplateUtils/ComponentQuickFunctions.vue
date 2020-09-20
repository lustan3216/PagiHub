<template>
  <div
    v-if="node"
    :id="`quick-fn-${id}`"
    :style="{
      zIndex: isExample ? 3000 : 800
    }"
    :class="{ instance: isInstance }"
    class="quick-functions flex-center"
  >
    <el-button
      v-if="canAddComponent"
      icon="el-icon-circle-plus-outline"
      style="font-size: 18px;"
      class="can-action"
      type="text"
      @click="tryToAddComponent"
    />

    <div
      :class="[top > 100 ? 'top' : 'bottom']"
      class="wrapper flex"
    >
      <div
        class="flex"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
      >
        <div class="component-name">
          <transition-group name="full-slide">
            <template v-for="(node, index) in parentNodes">
              <i
                v-if="hovering && index"
                :key="node.id + 'i'"
                class="el-icon-arrow-right"
              />
              <component-name
                v-if="hovering || node.id === id"
                :key="node.id"
                :id="node.id"
                :editable="false"
                :is-example="isExample"
                @click="SET_SELECTED_COMPONENT_ID(node.id)"
              >
                <i
                  v-if="node.id === id"
                  :class="[
                    itemEditing ? 'el-icon-edit-outline' : 'el-icon-rank'
                  ]"
                />
              </component-name>
            </template>
          </transition-group>
        </div>
      </div>

      <el-button-group class="flex">
        <inheritance-jumper
          :id="id"
          :inherit-parent-id="inheritParentId"
          :master-component-set-id="masterComponentSetId"
        />

        <portal-target
          v-if="isDraftMode"
          :name="`QuickFunctions${id}`"
          slim
        />

        <z-index />

        <el-tooltip
          effect="light"
          placement="top"
        >
          <div slot="content">
            {{ newItemToolTip }}
            <span
              class="m-l-10"
              v-html="metaKey"
            /> + B
          </div>

          <el-button
            icon="el-icon-plus"
            class="icon"
            @click="vmCreateEmptyItem"
          />
        </el-tooltip>

        <el-Popover
          ref="popover"
          effect="light"
          placement="right"
          popper-class="transparent"
        >
          <context-menu :id="id" />
        </el-Popover>
        <el-button
          v-popover:popover
          icon="el-icon-more"
          class="icon"
        />
      </el-button-group>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import ComponentName from './ComponentName'
import ZIndex from '@/components/Setup/EditorStyle/ZIndex'
import ContextMenu from './ContextMenu'
import InheritanceJumper from './InheritanceJumper'
import { Popover } from 'element-ui'
import {
  isGridItem,
  getNode,
  getClosetGrimItem,
  isComponentSet,
  traversalAncestorAndSelf,
  isComponent
} from '@/utils/node'
import { arrayLast } from '@/utils/array'
import { CAN_NEW_ITEM, CAROUSEL, GRID_GENERATOR, LAYERS } from '@/const'
import { vmCreateEmptyItem, vmGet } from '@/utils/vmMap'
import { isMac } from '@/utils/device'
import { isInstance } from '@/utils/inheritance'
import gsap from 'gsap'

let topShared = window.innerHeight / 2
let leftShared = window.innerWidth / 2
let widthShared = 0
let heightShared = 0

export const quickFnMap = {}

if (process.env.NODE_ENV !== 'production') {
  window.quickFnMap = quickFnMap
}

export default {
  name: 'ComponentQuickFunctions',
  components: {
    InheritanceJumper,
    ComponentName,
    ZIndex,
    ContextMenu,
    ElPopover: Popover
  },
  props: {
    id: {
      type: String,
      required: true
    },
    inheritParentId: {
      type: String,
      default: ''
    },
    masterComponentSetId: {
      type: String,
      default: ''
    },
    itemEditing: {
      type: Boolean,
      default: false
    },
    isExample: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      top: topShared,
      left: leftShared,
      width: widthShared,
      height: heightShared,
      animationId: null,
      canGoBack: null,
      hovering: false
    }
  },
  computed: {
    ...mapState('app', [
      'copyComponentIds',
      'selectedComponentIds',
      'selectedComponentNode'
    ]),
    ...mapState('layout', ['gridResizing']),
    parentNodes() {
      const nodes = []
      traversalAncestorAndSelf(this.node, node => {
        if (isComponent(node)) {
          nodes.push(node)
        }
        else {
          return false
        }
      })

      return nodes
    },
    newItemToolTip() {
      if (this.node[CAN_NEW_ITEM]) {
        switch (this.node.tag) {
          case LAYERS:
            return 'Create An New Layer'
          case GRID_GENERATOR:
            return 'Create An Empty Grid Item'
          case CAROUSEL:
            return 'Create An Empty Slider'
        }
      }
      else {
        return 'Copy An Empty Grid Item From It'
      }
    },
    metaKey() {
      return isMac() ? '&#8984;' : '&#8963;'
    },
    node() {
      return getNode(this.id)
    },
    isGridItem() {
      return isGridItem(this.node)
    },
    isInstance() {
      return isInstance(this.node)
    },
    isLastOne() {
      return arrayLast(this.selectedComponentIds) === this.id
    },
    isComponentSet() {
      return isComponentSet(this.node)
    },
    canAddComponent() {
      if (
        (!this.isExample && this.isGridItem && this.isLastOne) ||
        this.isComponentSet
      ) {
        const { children = [] } = this.node
        return !children.length
      }
    },
    framer() {
      // 如果有refs=framer, 在拉動window時不知為什麼會找不到element
      return document.getElementById(`quick-fn-${this.id}`)
    }
  },
  created() {
    this.resize()
  },
  mounted() {
    // Don't put in created to prevent some component fail before mount
    // 給 store component 裡面呼叫的
    quickFnMap[this.id] = this
    if (process.env.NODE_ENV === 'production') {
      window.quickFnMap = quickFnMap
    }
  },
  methods: {
    ...mapMutations('app', ['SET_SELECTED_COMPONENT_ID']),
    ...mapActions('app', ['setCopySelectedNodeId', 'setBeingAddedComponentId']),
    tryToAddComponent() {
      this.setBeingAddedComponentId(this.id)
    },
    vmCreateEmptyItem() {
      vmCreateEmptyItem(this.node)
    },
    resize() {
      const self = this
      this.$nextTick(() => {
        if (!this.node) {
          return
        }

        const gridItem = getClosetGrimItem(this.node.id)
        const vm = vmGet(
          (gridItem && gridItem.id) || this.node.id,
          this.isExample
        )
        const element = vm && vm.$el

        if (!element) {
          return
        }

        const rect = element.getBoundingClientRect()

        let { x: left, y: top, width, height } = rect

        let bounderNode
        if (this.isExample) {
          bounderNode = element.closest('.card')
        }
        else {
          bounderNode = document.getElementById('art-board')
        }

        const { y: top1, height: height1 } = bounderNode.getBoundingClientRect()

        // this.visible = top < top1 + height1
        // if (!this.visible) {
        //   return
        // }

        top = top < top1 ? top1 : top
        height =
          rect.top + height >= top1 + height1
            ? top1 + height1 - top
            : rect.top < top1
              ? rect.top + height - top1
              : height

        if (height < 10 || width < 10) {
          return
        }

        gsap.fromTo(
          this.framer,
          {
            x: leftShared,
            y: topShared,
            width: widthShared,
            height: heightShared
          },
          {
            x: Math.round(left),
            y: Math.round(top + 1),
            width: Math.round(width - 2),
            height: Math.round(height - 2),
            ease: 'ease',
            onUpdate() {
              const { width, height, x, y } = this.vars
              leftShared = x
              topShared = y
              widthShared = width
              heightShared = height
              self.top = y
            }
          }
        )
      })
    }
  }
}
</script>

<style scoped lang="scss">
$activeColor: rgba(81, 117, 199, 0.68);
$connectColor: rgba(135, 199, 124, 0.68);

::v-deep.instance,
::v-deep .el-button {
  &.quick-functions,
  .wrapper > *,
  .button-group > * {
    border-color: $connectColor !important;
    color: $connectColor !important;
  }

  .button-group i {
    color: $connectColor;
  }
  .can-action {
    color: $connectColor;
  }
}

.quick-functions {
  position: absolute;
  pointer-events: none;
  border: 1px dashed $activeColor;
  top: 0;
  left: 0;
}

.wrapper {
  pointer-events: all;
  position: absolute;
}

.top {
  left: 0;
  top: -35px;
}

.bottom {
  left: 5px;
  top: 5px;
}

.right {
  right: -28px;
  bottom: 0;
}

.el-icon-more-outline {
  transform: rotate(90deg);
}

.component-name {
  background-color: white;
  white-space: pre;
  padding-right: 5px;
  padding-left: 5px;
  border: 1px solid $activeColor;
  border-radius: 5px;
  color: $activeColor !important;
  font-size: 12px;
  font-weight: 500;
  height: 28px;
  transition: all 0.5s ease;
}

::v-deep > .el-button {
  color: $activeColor !important;
}

::v-deep .el-button-group {
  margin-left: 10px;

  button {
    padding: 5px 8px;
    border: 1px solid $activeColor;
  }

  i {
    color: $activeColor;
  }
}
</style>
