<template>
  <component
    :is="isFloat ? 'DialogInteracted' : 'div'"
    :class="{ float: isFloat }"
    class="sidebar"
  >
    <el-button
      :icon="`el-icon${isFloat ? '-map' : ''}-location`"
      class="transparent"
      circle
      type="mini"
      @click="isFloat = !isFloat"
    />

    <el-tabs v-model="activeName">
      <el-tab-pane label="Components" name="Components" lazy>
        <tree-components />
      </el-tab-pane>

      <el-tab-pane label="Nodes " name="Nodes" lazy>
        <tree-nodes />
      </el-tab-pane>

      <el-tab-pane label="CSS " name="css" lazy>
        <tree-css />
      </el-tab-pane>

      <template v-if="canShowSetting">
        <el-tab-pane label="Setting" name="setting" lazy>
          <setting-nested :id="selectedComponentId" :specs="specs" />
        </el-tab-pane>

        <el-tab-pane label="Style" name="style" lazy>
          <setting-styles />
        </el-tab-pane>
      </template>

      <el-tab-pane label="Color" name="Color" lazy />
    </el-tabs>
  </component>
</template>

<script>
import clone from 'clone'
import formCreate from '@form-create/element-ui'
import { mapState, mapGetters } from 'vuex'
import SettingStyles from './SettingStyles'
import SettingNested from './SettingNested'
import allSettingSpecs from '../../settings'
import FlexSidebar from '../Templates/FlexSidebar'
import DialogInteracted from '../Components/DialogInteracted'

export default {
  name: 'SidebarRight',
  components: {
    FlexSidebar,
    SettingStyles,
    SettingNested,
    DialogInteracted,
    FormCreate: formCreate.$form(),
    TreeNodes: () => import('./TreeNodes'),
    TreeComponents: () => import('./TreeComponents'),
    TreeCss: () => import('./TreeCss')
  },
  data() {
    return {
      isFloat: false,
      activeName: 'Components'
    }
  },
  computed: {
    ...mapState('nodes', ['currentNodesMap']),
    ...mapGetters('app', ['selectedComponentId', 'selectedComponentNode']),
    canShowSetting() {
      return (
        this.selectedComponentNode &&
        this.specs &&
        Object.keys(this.specs).length
      )
    },
    specs() {
      return clone(allSettingSpecs[this.selectedComponentNode.tag.camelCase()])
    }
  },
  watch: {
    isFloat(value) {
      if (!value) {
        this.$el.style.webkitTransform = null
      }
    }
  }
}
</script>

<style>
.sidebar {
  padding-right: 10px;
  width: 350px;
  overflow: hidden;
}

.float {
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.87);
  box-shadow: 1px 1px 19px 6px rgba(0, 0, 0, 0.1);
  position: absolute;
  left: calc(100vw - 350px);
  bottom: 0;
  top: 0;
}
</style>
