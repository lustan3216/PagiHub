<template>
  <div
    v-if="node"
    :id="`quick-fn-${id}`"
    :style="{
      zIndex: isExample ? 3000 : 800
    }"
    class="quick-functions flex-center"
  >
    <el-button
      v-if="canAddComponent"
      icon="el-icon-circle-plus-outline"
      style="font-size: 16px;"
      class="can-action"
      type="text"
      @click="tryToAddComponent"
    />

    <div
      :class="[top > 100 ? 'top' : 'bottom']"
      class="wrapper flex"
    >
      <component-name
        :id="id"
        class="title"
      >
        <i :class="[itemEditing ? 'el-icon-edit-outline' : 'el-icon-rank']" />
      </component-name>

      <portal-target
        v-if="isDraftMode"
        :name="`QuickFunctions${id}`"
        class="button-group"
      />
    </div>

    <div
      v-if="!isExample"
      class="left wrapper"
    >
      <el-tooltip
        effect="light"
        placement="left"
      >
        <div slot="content">
          {{ newItemToolTip }} <span
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

      <context-menu :id="id" />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import ComponentName from './ComponentName'
import ContextMenu from './ContextMenu'
import { Popover } from 'element-ui'
import { isGridItem, getNode } from '@/utils/node'
import { arrayLast } from '@/utils/tool'
import { CAN_NEW_ITEM, CAROUSEL, GRID_GENERATOR, LAYERS } from '@/const'
import { vmCreateEmptyItem, vmGet } from '@/utils/vmMap'
import { isMac } from '@/utils/device'
import gsap from 'gsap'

let topShared = window.innerHeight / 2
let leftShared = window.innerWidth / 2
let widthShared = 0
let heightShared = 0

export const quickFnMap = {}

export default {
  name: 'ComponentQuickFunctions',
  components: {
    ComponentName,
    ContextMenu,
    ElPopover: Popover
  },
  inject: {
    rootComponentSetId: { default: null }
  },
  props: {
    id: {
      type: String,
      required: true
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
      animationId: null
    }
  },
  computed: {
    ...mapState('app', [
      'copyComponentIds',
      'selectedComponentIds',
      'selectedComponentNode',
      'isArtBoardResizing'
    ]),
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
    canAddComponent() {
      const isLastOne = arrayLast(this.selectedComponentIds) === this.id

      if (!this.isExample && this.isGridItem && isLastOne) {
        const { children = [] } = this.node
        return !children.length
      }
    },
    framer() {
      // 如果有refs=framer, 在拉動window時不知為什麼會找不到element
      return document.getElementById(`quick-fn-${this.id}`)
    },
    componentSetEl() {
      const { rootComponentSetId } = this.node
      if (!rootComponentSetId) {
        // this context will happen in Baic components in example tabs
        return
      }
      const componentSetNode = vmGet(rootComponentSetId, this.isExample)
      return componentSetNode.$el
    }
  },
  watch: {
    isArtBoardResizing(value) {
      if (value) {
        this.framer.style.opacity = 0
      }
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
  beforeDestroy() {
    cancelAnimationFrame(this.animationId)
  },
  methods: {
    ...mapMutations('app', {
      APP_SET: 'SET'
    }),
    ...mapMutations('app', ['DIALOG_OPEN']),
    ...mapActions('app', ['setCopySelectedNodeId', 'setBeingAddedComponentId']),
    tryToAddComponent() {
      this.setBeingAddedComponentId(this.id)
    },
    vmCreateEmptyItem() {
      vmCreateEmptyItem(this.node)
    },
    resize() {
      this.$nextTick(() => {
        if (!this.node || !this.componentSetEl) {
          return
        }

        const vm = vmGet(this.node.id, this.isExample)
        const element = vm && vm.$el

        if (!element) {
          return
        }

        const rect = element.getBoundingClientRect()
        let { x: left, y: top, width, height } = rect
        const {
          y: top1,
          height: height1
        } = this.componentSetEl.parentElement.getBoundingClientRect()

        top = top < top1 ? top1 : top
        height =
          rect.top + height >= top1 + height1
            ? top1 + height1 - top
            : rect.top < top1
              ? rect.top + height - top1
              : height

        gsap.fromTo(
          this.framer,
          {
            opacity: 0,
            x: leftShared,
            y: topShared,
            width: widthShared,
            height: heightShared
          },
          {
            opacity: 1,
            x: left,
            y: top,
            width: width - 2,
            height: height - 2,
            ease: 'power3',
            duration: 0.7,
            onUpdate() {
              const { width, height, x, y } = this.vars
              leftShared = x
              topShared = y
              widthShared = width
              heightShared = height
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
  top: -30px;
}

.left {
  left: -28px;
  top: 5px;
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
.title {
  background-color: white;
  padding: 5px;
  border: 1px solid $activeColor;
  border-radius: 5px;
  color: $activeColor !important;
}
.left.wrapper,
.right.wrapper {
  display: flex;
  flex-direction: column;
  & > * {
    cursor: pointer;
    background-color: white;
    padding: 3px;
    border: 1px solid $activeColor;
    margin-top: -1px;
  }

  i {
    color: $activeColor !important;
  }
  & > * {
    border-radius: 0;
  }

  & > *:first-child {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  & > *:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}

::v-deep.button-group {
  margin-left: 5px;
  display: flex;
  & > * {
    cursor: pointer;
    background-color: white;
    border: 1px solid $activeColor;
    margin-left: -1px;
  }

  button {
    padding: 5px;
  }

  i {
    color: $activeColor !important;
  }

  & > *:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  & > *:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}
</style>
