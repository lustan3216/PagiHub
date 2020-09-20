<template>
  <component-move :id="id">
    <template
      v-slot="{
        canMoveForward,
        canMoveBackward,
        moveForward,
        moveToFront,
        moveToBackward,
        moveToEnd
      }"
    >
      <div class="el-dropdown-menu">
        <div
          :class="{ 'is-disabled': !canMoveForward }"
          class="el-dropdown-menu__item"
          type="text"
          @click="moveToFront"
        >
          <span>Move to the front</span>
        </div>
        <div
          :class="{ 'is-disabled': !canMoveForward }"
          class="el-dropdown-menu__item"
          type="text"
          @click="moveForward"
        >
          <span>Move Forward</span>
        </div>
        <div
          :class="{ 'is-disabled': !canMoveBackward }"
          class="el-dropdown-menu__item"
          type="text"
          @click="moveToBackward"
        >
          <span>Move Backward</span>
        </div>
        <div
          :class="{ 'is-disabled': !canMoveBackward }"
          class="el-dropdown-menu__item"
          type="text"
          @click="moveToEnd"
        >
          <span>Move End</span>
        </div>

        <template v-for="option in options">
          <div
            v-if="option.divided"
            :key="`${option.name}-d`"
            class="el-dropdown-menu__item--divided"
          />

          <div
            :key="option.name"
            :divided="option.divided"
            :class="{ 'is-disabled': option.disabled }"
            class="el-dropdown-menu__item"
            type="text"
            @click="handleCommand(option.name)"
          >
            <div class="justify-between">
              <span>{{ option.name }}</span>
              <span
                v-if="option.shortKey"
                class="m-l-15"
                v-html="option.shortKey.join(' + ')"
              />
            </div>
          </div>
        </template>
      </div>
    </template>
  </component-move>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import { isGridItem } from '@/utils/node'
import { isMac } from '@/utils/device'
import {
  vmAddNode,
  vmPasteNodes,
  vmRemoveNode,
  vmBecomeMaster
} from '@/utils/vmMap'
import ComponentMove from './ComponentMove'
import { getValueByPath } from '@/utils/tool'
import { COMPONENT_SET } from '@/const'
import { isInstanceChild } from '@/utils/inheritance'

export default {
  name: 'ContextMenu',
  components: {
    ComponentMove
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState('app', [
      'copyComponentIds',
      'selectedComponentIds',
      'selectedComponentNode'
    ]),
    ...mapState('layout', ['gridResizing']),
    ...mapGetters('app', ['theOnlyCopyNodeAndNotGridItem']),
    node() {
      return this.nodesMap[this.id]
    },
    metaKey() {
      return isMac() ? '&#8984;' : '&#8963;'
    },
    theOnlyCopyNodeAndNotGridItem() {
      if (this.copyComponentIds.length === 1) {
        const node = this.nodesMap[this.copyComponentIds[0]]
        return node && !isGridItem(node)
      }
    },
    canNotDelete() {
      const { parentNode } = this.node
      if (
        getValueByPath(parentNode, 'parentNode.tag') === COMPONENT_SET &&
        parentNode.children.length === 1
      ) {
        return true
      }
      else if (
        getValueByPath(parentNode, 'parentNode.parentNode.tag') ===
          COMPONENT_SET &&
        parentNode.children.length === 1
      ) {
        return true
      }
    },
    options() {
      return [
        {
          name: 'Copy',
          shortKey: [this.metaKey, 'C'],
          divided: true
        },
        {
          name: 'Paste Inside',
          shortKey: [this.metaKey, 'V'],
          disabled:
            !this.theOnlyCopyNodeAndNotGridItem || !isGridItem(this.node)
        },
        {
          name: 'Replace',
          shortKey: [this.metaKey, 'V'],
          disabled: !this.theOnlyCopyNodeAndNotGridItem || isGridItem(this.node)
        },
        {
          name: 'Cut',
          shortKey: [this.metaKey, 'X'],
          disabled: this.selectedComponentIds.length !== 1
        },
        { name: 'Duplicate' },
        {
          name: 'Delete',
          shortKey: ['&#9003;'],
          disabled: isInstanceChild(this.node)
        },
        {
          name: 'Make Master Component',
          divided: true
        }
      ]
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    ...mapActions('app', ['setCopySelectedNodeId']),
    handleCommand(command) {
      switch (command) {
        case 'Copy':
          this.setCopySelectedNodeId(this.id)
          break
        case 'Paste Inside':
          vmPasteNodes()
          break
        case 'Replace':
          vmPasteNodes()
          break
        case 'Cut':
          this.setCopySelectedNodeId(this.id)
          vmRemoveNode(this.node)
          break
        case 'Duplicate':
          this.APP_SET({ copyComponentIds: [this.id] })
          vmAddNode(this.node)
          break
        case 'Delete':
          vmRemoveNode(this.node)
          break
        case 'Make Master Component':
          vmBecomeMaster(this.node)
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-dropdown-menu__item--divided {
  padding: 0 20px;
}
.el-dropdown-menu {
  z-index: 1000;
}
.el-dropdown-menu__item {
  line-height: 27px;
  font-size: 13px;
  white-space: pre;
}
</style>
