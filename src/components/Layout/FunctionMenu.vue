<template>
  <el-menu mode="horizontal">
    <el-submenu
      popper-class="dashboard-menu"
      index="menu"
    >
      <template slot="title">
        <b-icon-list />
      </template>

      <el-menu-item @click="$router.push({ name: 'Help' })">
        Help
      </el-menu-item>

      <el-submenu index="edit">
        <template slot="title">Edit</template>
        <el-menu-item
          v-for="(option, index) in editOptions"
          :key="index"
          @click="option.fn"
        >
          <i
            v-shortkey="option.shortKey"
            :disabled="option.disabled"
            @shortkey.propgate="option.fn"
          />
          <div class="justify-between">
            {{ option.name }}
            <i
              v-if="option.shortKeyString"
              class="m-l-15 gray-font-2"
              v-html="option.shortKeyString.join('')"
            />
          </div>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="arrange">
        <template slot="title">Arrange</template>
        <component-group>
          <template
            v-slot="{
              canGroup,
              canUngroup,
              group,
              ungroup
            }"
          >
            <el-menu-item-group title="Group">
              <el-menu-item
                :disabled="!canGroup"
                @click="group"
              >
                <i
                  v-shortkey="[ctrlKey, 'g']"
                  :disabled="!canGroup"
                  @shortkey="group"
                />

                <div class="justify-between">
                  <span>Group</span>
                  <i
                    class="gray-font-2"
                    v-html="`${ctrlKeyIcon}G`"
                  />
                </div>
              </el-menu-item>

              <el-menu-item
                :disabled="!canUngroup"
                @click="ungroup"
              >
                Ungroup
              </el-menu-item>
            </el-menu-item-group>
          </template>
        </component-group>

        <component-move>
          <template
            v-slot="{
              canMoveForward,
              canMoveBackward,
              moveToFront,
              moveForward,
              moveToEnd,
              moveToBackward
            }"
          >
            <el-menu-item-group title="Align">
              <el-menu-item
                :disabled="!canMoveForward"
                @click="moveToFront"
              >
                <i
                  v-shortkey="[ctrlKey, altKey, ']']"
                  :disabled="!canMoveForward"
                  @shortkey.propgate="moveToFront"
                />

                <div class="justify-between">
                  <span>Move to Front</span>
                  <i
                    class="gray-font-2"
                    v-html="[altKeyIcon, ctrlKeyIcon, ']'].join('')"
                  />
                </div>
              </el-menu-item>

              <el-menu-item
                :disabled="!canMoveForward"
                @click="moveForward"
              >
                <i
                  v-shortkey="[ctrlKey, ']']"
                  :disabled="!canMoveForward"
                  @shortkey="moveForward"
                />

                <div class="justify-between">
                  <span>Move Forward</span>
                  <i
                    class="gray-font-2"
                    v-html="[ctrlKeyIcon, ']'].join('')"
                  />
                </div>
              </el-menu-item>

              <el-menu-item
                :disabled="!canMoveBackward"
                @click="moveToBackward"
              >
                <i
                  v-shortkey="[ctrlKey, '[']"
                  :disabled="!canMoveBackward"
                  @shortkey="moveToBackward"
                />

                <div class="justify-between">
                  <span>Move Backward</span>
                  <i
                    class="gray-font-2"
                    v-html="[ctrlKeyIcon, '['].join('')"
                  />
                </div>
              </el-menu-item>

              <el-menu-item
                :disabled="!canMoveBackward"
                @click="moveToEnd"
              >
                <i
                  v-shortkey="[ctrlKey, altKey, '[']"
                  :disabled="!canMoveBackward"
                  @shortkey="moveToEnd"
                />

                <div class="justify-between">
                  <span>Move to End</span>
                  <i
                    class="gray-font-2"
                    v-html="[altKeyIcon, ctrlKeyIcon, '['].join('')"
                  />
                </div>
              </el-menu-item>

            </el-menu-item-group>
          </template>
        </component-move>
      </el-submenu>
    </el-submenu>
  </el-menu>
</template>

<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'
import { isMac } from '@/utils/device'
import { vmPasteNodes, vmRemoveNode, vmPasteNodesGrid, vmPasteNodesHtmlStyle } from '@/utils/vmMap'
import { Menu, MenuItem, Submenu, MenuItemGroup } from 'element-ui'
import ComponentGroup from '@/components/TemplateUtils/ComponentGroup'
import ComponentMove from '@/components/TemplateUtils/ComponentMove'
import { BIconList } from 'bootstrap-vue'

export default {
  name: 'FunctionMenu',
  components: {
    BIconList,
    ElMenu: Menu,
    ElMenuItem: MenuItem,
    ElSubmenu: Submenu,
    ElMenuItemGroup: MenuItemGroup,
    ComponentGroup,
    ComponentMove
  },
  computed: {
    ...mapState('app', ['copyComponentIds', 'selectedComponentIds']),
    ...mapGetters('app', ['selectedComponentNodes']),
    altKey() {
      return 'alt'
    },
    altKeyIcon() {
      return isMac() ? '&#8997;' : 'Alt '
    },
    ctrlKey() {
      return isMac() ? 'meta' : 'ctrl'
    },
    ctrlKeyIcon() {
      return isMac() ? '&#8984;' : '&#8963;'
    },
    editOptions() {
      return [
        {
          name: 'Clean Selection',
          shortKey: ['esc'],
          shortKeyString: ['Esc'],
          fn: this.cleanAppState
        },
        {
          name: 'Undo',
          shortKey: [this.ctrlKey, 'z'],
          shortKeyString: [this.ctrlKeyIcon, 'Z'],
          fn: this.UNDO
        },
        {
          name: 'Redo',
          shortKey: [this.ctrlKey, 'shift', 'z'],
          shortKeyString: [this.ctrlKeyIcon, '&#8679;', 'Z'],
          fn: this.REDO
        },
        {
          name: 'Copy',
          shortKey: [this.ctrlKey, 'c'],
          shortKeyString: [this.ctrlKeyIcon, 'C'],
          disabled: !this.selectedComponentIds.length,
          fn: () => this.setCopySelectedNodeId(null)
        },
        {
          name: 'Paste',
          shortKey: [this.ctrlKey, 'v'],
          shortKeyString: [this.ctrlKeyIcon, 'v'],
          disabled: !this.copyComponentIds.length,
          fn: this.vmPasteNodes
        },
        {
          name: 'Paste Style',
          disabled: !this.copyComponentIds.length,
          fn: vmPasteNodesHtmlStyle
        },
        {
          name: 'Paste Grid',
          disabled: !this.copyComponentIds.length,
          fn: vmPasteNodesGrid
        },
        {
          name: 'Cut',
          shortKey: [this.ctrlKey, 'x'],
          shortKeyString: [this.ctrlKeyIcon, 'X'],
          disabled: this.selectedComponentIds.length !== 1,
          fn: this.cut
        },
        {
          name: 'Delete',
          shortKey: { a: ['backspace'], b: ['del'] },
          shortKeyString: ['&#9003;'],
          disabled: !this.selectedComponentIds.length,
          fn: this.multiDelete
        }
      ]
    }
  },
  methods: {
    ...mapMutations('node', ['REDO', 'UNDO']),
    ...mapActions('app', ['setCopySelectedNodeId']),
    ...mapMutations('app', { APP_SET: 'SET' }),

    isMac,
    vmPasteNodes,
    multiDelete() {
      this.selectedComponentNodes.forEach(node => vmRemoveNode(node))
    },
    cut() {
      this.setCopySelectedNodeId(this.selectedComponentIds)
      this.selectedComponentNodes.forEach(node => vmRemoveNode(node))
    },
    cleanAppState() {
      this.APP_SET({
        isAdding: false,
        beingAddedComponentId: null,
        selectedComponentIds: []
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.el-menu:not(.dashboard-menu) {
  border-bottom: none;

  .el-submenu__title {
    height: 44px;
    line-height: 44px;
    font-size: 18px;
    border-bottom: none;
  }

  .el-submenu__icon-arrow {
    display: none;
  }

  .el-submenu__icon-arrow {
    margin-top: -1px;
  }
}
</style>
<style lang="scss">
.dashboard-menu {
  top: 40px !important;

  .el-menu-item {
    padding: 0 20px !important;
    color: #606266 !important;
    :hover {
      color: #66b1ff;
    }
  }
  [role='menuitem'],
  .el-submenu__title {
    font-size: 13px;
    line-height: 27px !important;
    height: 27px !important;
  }

  .el-submenu__title {
    padding: 0 20px !important;
  }

  .el-menu-item-group__title {
    padding-left: 10px!important;
  }
}
</style>
