<template>
  <div class="el-dropdown-menu">
    <component-move>
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
        <div>
          <div
            :class="{ 'is-disabled': !canMoveForward }"
            class="el-dropdown-menu__item"
            type="text"
            @click="close(moveToFront)"
          >
            <span>Move to the front</span>
          </div>
          <div
            :class="{ 'is-disabled': !canMoveForward }"
            class="el-dropdown-menu__item"
            type="text"
            @click="close(moveForward)"
          >
            <span>Move Forward</span>
          </div>
          <div
            :class="{ 'is-disabled': !canMoveBackward }"
            class="el-dropdown-menu__item"
            type="text"
            @click="close(moveToBackward)"
          >
            <span>Move Backward</span>
          </div>
          <div
            :class="{ 'is-disabled': !canMoveBackward }"
            class="el-dropdown-menu__item"
            type="text"
            @click="close(moveToEnd)"
          >
            <span>Move End</span>
          </div>
        </div>
      </template>
    </component-move>

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

    <div class="el-dropdown-menu__item--divided" />

    <component-group>
      <template
        v-slot="{
          canGroup,
          canUngroup,
          group,
          ungroup
        }"
      >
        <div>
          <div
            :class="{ 'is-disabled': !canGroup }"
            class="el-dropdown-menu__item"
            type="text"
            @click="group"
          >
            <div class="justify-between">
              <span>Group</span>
              <span v-html="`${metaKey} + G`" />
            </div>
          </div>

          <div
            :class="{ 'is-disabled': !canUngroup }"
            class="el-dropdown-menu__item"
            type="text"
            @click="ungroup"
          >
            <div class="justify-between">
              <span>Ungroup</span>
            </div>
          </div>
        </div>
      </template>
    </component-group>

    <div class="el-dropdown-menu__item--divided" />

    <lock
      :id="node.id"
      type="text"
      visible
      class="el-dropdown-menu__item"
    >
      <template v-slot="{ lock }">
        <div class="justify-between">
          <span>{{ lock ? 'Unlock' : 'Lock' }}</span>
          <span
            class="m-l-15"
            v-html="`${metaKey} + L`"
          />
        </div>
      </template>
    </lock>
  </div>
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
import ComponentGroup from './ComponentGroup'
import Lock from '../Setup/EditorStyle/Lock'
import ClickOutside from '@/directive/clickOutside'
import { arrayLast } from '@/utils/array'

export default {
  name: 'ContextMenu',
  components: {
    Lock,
    ComponentMove,
    ComponentGroup
  },
  directives: {
    ClickOutside
  },

  props: {
    left: {
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapState('app', ['copyComponentIds', 'selectedComponentIds']),
    ...mapGetters('app', [
      'selectedComponentNodes',
      'theOnlySelectedComponentId'
    ]),
    ...mapState('layout', ['gridResizing']),
    node() {
      return arrayLast(this.selectedComponentNodes)
    },
    metaKey() {
      return isMac() ? '&#8984;' : '&#8963;'
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
          disabled: isGridItem(this.node)
        },
        {
          name: 'Replace',
          shortKey: [this.metaKey, 'V'],
          disabled: !isGridItem(this.node)
        },
        {
          name: 'Cut',
          shortKey: [this.metaKey, 'X'],
          disabled: this.selectedComponentIds.length !== 1
        },
        { name: 'Duplicate', disabled: !this.selectedComponentNodes.length },
        {
          name: 'Delete',
          shortKey: ['&#9003;'],
          disabled: !this.selectedComponentNodes.length
        }
        // {
        //   name: 'Make Master Component',
        //   divided: true
        // }
      ]
    }
  },
  methods: {
    ...mapMutations('app', { APP_SET: 'SET' }),
    ...mapActions('app', ['setCopySelectedNodeId']),
    close(fn) {
      fn()
      this.$emit('close')
    },
    handleCommand(command) {
      switch (command) {
        case 'Copy':
          this.setCopySelectedNodeId(this.selectedComponentIds)
          break
        case 'Cut':
          this.setCopySelectedNodeId(this.selectedComponentIds)
          this.selectedComponentNodes.forEach(node => vmRemoveNode(node))
          break
        default:
          this.selectedComponentNodes.forEach(node => {
            switch (command) {
              case 'Paste Inside':
                vmPasteNodes()
                break
              case 'Replace':
                vmPasteNodes()
                break
              case 'Duplicate':
                this.APP_SET({ copyComponentIds: [node.id] })
                vmAddNode(node)
                break
              case 'Delete':
                vmRemoveNode(node)
                break
              case 'Make Master Component':
                vmBecomeMaster(node)
                break
            }
          })
      }

      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
.el-dropdown-menu__item--divided {
  padding: 0 20px;
}
.el-dropdown-menu {
  z-index: 3000;
}
.el-dropdown-menu__item {
  line-height: 27px;
  font-size: 13px;
  white-space: pre;
}
</style>
