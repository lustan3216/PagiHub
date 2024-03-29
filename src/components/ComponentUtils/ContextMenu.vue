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
            <div class="justify-between">
              <span>Move to Front</span>
              <i
                class="gray-font-2"
                v-html="[altKeyIcon, ctrlKeyIcon, ']'].join('')"
              />
            </div>
          </div>
          <div
            :class="{ 'is-disabled': !canMoveForward }"
            class="el-dropdown-menu__item"
            type="text"
            @click="close(moveForward)"
          >
            <div class="justify-between">
              <span>Move Forward</span>
              <i
                class="gray-font-2"
                v-html="[ctrlKeyIcon, ']'].join('')"
              />
            </div>
          </div>
          <div
            :class="{ 'is-disabled': !canMoveBackward }"
            class="el-dropdown-menu__item"
            type="text"
            @click="close(moveToBackward)"
          >
            <div class="justify-between">
              <span>Move Backward</span>
              <i
                class="gray-font-2"
                v-html="[ctrlKeyIcon, '['].join('')"
              />
            </div>
          </div>
          <div
            :class="{ 'is-disabled': !canMoveBackward }"
            class="el-dropdown-menu__item"
            type="text"
            @click="close(moveToEnd)"
          >
            <div class="justify-between">
              <span>Move to End</span>
              <i
                class="gray-font-2"
                v-html="[altKeyIcon, ctrlKeyIcon, '['].join('')"
              />
            </div>
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
          <i
            v-if="option.shortKey"
            class="m-l-15 gray-font-2"
            v-html="option.shortKey.join('')"
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
              <i
                class="gray-font-2"
                v-html="`${ctrlKeyIcon}G`"
              />
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
      v-if="node"
      :id="node.id"
      type="text"
      visible
      class="el-dropdown-menu__item"
    >
      <template v-slot="{ lock }">
        <div class="justify-between">
          <span>{{ lock ? 'Unlock' : 'Lock' }}</span>
          <i
            class="m-l-15 gray-font-2"
            v-html="`${ctrlKeyIcon} L`"
          />
        </div>
      </template>
    </lock>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import { isMac } from '@/utils/device'
import { vmPasteNodes, vmRemoveNode, vmPasteNodesHtmlStyle, vmPasteNodesGrid } from '@/utils/vmMap'
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
    ctrlKeyIcon() {
      return isMac() ? '&#8984;' : '&#8963;'
    },
    altKeyIcon() {
      return isMac() ? '&#8997;' : 'Alt'
    },
    options() {
      return [
        {
          name: 'Copy',
          shortKey: [this.ctrlKeyIcon, 'C'],
          divided: true
        },
        {
          name: 'Paste',
          shortKey: [this.ctrlKeyIcon, 'V']
        },
        {
          name: 'Paste Style',
          disabled: !this.copyComponentIds.length
        },
        {
          name: 'Paste Grid',
          disabled: !this.copyComponentIds.length
        },
        {
          name: 'Cut',
          shortKey: [this.ctrlKeyIcon, 'X'],
          disabled: this.selectedComponentIds.length !== 1
        },
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
              case 'Paste':
                vmPasteNodes()
                break
              case 'Paste Style':
                vmPasteNodesHtmlStyle()
                break
              case 'Paste Grid':
                vmPasteNodesGrid()
                break
              case 'Delete':
                vmRemoveNode(node)
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
