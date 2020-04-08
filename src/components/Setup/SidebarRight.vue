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
      <el-tab-pane
        label="Project"
        name="Project"
        lazy
      >
        <tree-project />
      </el-tab-pane>

      <el-tab-pane
        label="Nodes "
        name="Nodes"
        lazy
      >
        <tree-nodes v-if="draftComponentId" />
      </el-tab-pane>

      <el-tab-pane
        label="Setting"
        name="setting"
        lazy
      >
        <setting-nested
          v-if="canShowSetting"
          :id="theOnlySelectedComponentId"
          :specs="specs"
        />
      </el-tab-pane>

      <el-tab-pane
        label="Style"
        name="style"
        lazy
      >
        <setting-styles v-if="selectedComponentIds.length" />
      </el-tab-pane>
    </el-tabs>
  </component>
</template>

<script>
import formCreate from '@form-create/element-ui'
import { mapState, mapGetters } from 'vuex'
import SettingStyles from './SettingStyles'
import SettingNested from './SettingNested'
import allSettingSpecs from '../../settings'
import { cloneJson } from '../../utils/tool'
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
    TreeProject: () => import('./TreeProject')
  },
  data() {
    return {
      isFloat: false,
      activeName: 'Project'
    }
  },
  computed: {
    ...mapState('draft', ['nodesMap', 'draftComponentId']),
    ...mapState('app', ['selectedComponentIds']),
    ...mapGetters('app', [
      'theOnlySelectedComponentId',
      'selectedComponentNode'
    ]),
    canShowSetting() {
      return this.specs && Object.hasAnyKey(this.specs)
    },
    specs() {
      if (!this.selectedComponentNode) return
      return cloneJson(
        allSettingSpecs[this.selectedComponentNode.tag.camelCase()]
      )
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
  width: 300px;
  overflow: hidden;
  position: fixed;
  bottom: 0;
  top: 0;
  left: calc(100vw - 300px);
  z-index: 300;
}

.float {
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.87);
  box-shadow: 1px 1px 19px 6px rgba(0, 0, 0, 0.1);
}
</style>
