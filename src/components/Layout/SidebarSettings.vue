<template>
  <flex-sidebar v-if="canShowSetting" class="sidebar">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Setting" name="first">
        <nested-settings :id="settingId" :specs="specs" :key="settingId" />
      </el-tab-pane>
      <el-tab-pane label="Style" name="second">
        <sidebar-style :id="settingId" />
      </el-tab-pane>
    </el-tabs>
  </flex-sidebar>
</template>

<script>
import clone from 'clone'
import { mapState } from 'vuex'
import { vmMap } from '../../utils/vmMap'
import globalStatus from '../../observable/globalStatus'
import FlexSidebar from '../Templates/FlexSidebar'
import SidebarStyle from '../Layout/SidebarStyle'
import formCreate from '@form-create/element-ui'
import allSettingSpecs from '../../settings'
import NestedSettings from './NestedSettings'
import { camelCase } from '../../lodash'

export default {
  name: 'SidebarSettings',
  components: {
    SidebarStyle,
    FlexSidebar,
    NestedSettings,
    FormCreate: formCreate.$form()
  },
  data() {
    return {
      activeName: 'second'
    }
  },
  computed: {
    ...mapState('nodes', ['currentNodesMap']),
    canShowSetting() {
      return (
        this.settingId &&
        this.node &&
        this.specs &&
        Object.keys(this.specs).length
      )
    },
    specs() {
      return clone(allSettingSpecs[camelCase(this.node.tag)])
    },
    node() {
      return this.currentNodesMap[this.settingId]
    },
    settingId() {
      return globalStatus.settingId
    },
    vm() {
      return vmMap[this.settingId]
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style>
.sidebar {
  padding: 0 10px;
}
</style>
