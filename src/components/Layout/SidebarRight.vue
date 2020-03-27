<template>
  <flex-sidebar v-if="canShowSetting" class="sidebar">
    <el-tabs v-model="activeName" >
      
      <el-tab-pane label="Setting" name="setting" lazy>
        <settings-nested :id="settingId" :specs="specs" :key="settingId" />
      </el-tab-pane>
      
      <el-tab-pane label="Style" name="style" lazy>
        <settings-style :id="settingId" />
      </el-tab-pane>
      
      <el-tab-pane label="Color" name="Color" lazy/>
      
    </el-tabs>
  </flex-sidebar>
</template>

<script>
import clone from 'clone'
import formCreate from '@form-create/element-ui'
import { mapState } from 'vuex'
import globalStatus from '../../observable/globalStatus'
import FlexSidebar from '../Templates/FlexSidebar'
import SettingsStyle from './SettingStyles'
import SettingsNested from './SettingNested'
import allSettingSpecs from '../../settings'
import NodesTree from './TreeNodes.vue'

export default {
  name: 'SidebarRight',
  components: {
    SettingsStyle,
    FlexSidebar,
    SettingsNested,
    NodesTree,
    FormCreate: formCreate.$form()
  },
  data() {
    return {
      activeName: 'setting'
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
      return clone(allSettingSpecs[this.node.tag.camelCase()])
    },
    node() {
      return this.currentNodesMap[this.settingId]
    },
    settingId() {
      return globalStatus.settingId
    }
  }
}
</script>

<style>
.sidebar {
  padding: 0 10px;
  width: 300px;
}
</style>
