<template>
  <flex-sidebar v-if="canShowSetting" class="sidebar">
    <nested-settings :id="settingId" :specs="specs" :key="settingId" />
  </flex-sidebar>
</template>

<script>
import clone from 'clone'
import { mapState } from 'vuex'
import { vmMap } from '../../utils/vmMap'
import globalStatus from '../../observable/globalStatus'
import FlexSidebar from '../Templates/FlexSidebar'
import formCreate from '@form-create/element-ui'
import allSettingSpecs from '../../settings'
import NestedSettings from './NestedSettings'
import { camelCase } from '../../lodash'

export default {
  name: 'SidebarSettings',
  components: {
    FlexSidebar,
    NestedSettings,
    FormCreate: formCreate.$form()
  },
  computed: {
    ...mapState('nodes', ['currentNodesMap']),
    canShowSetting() {
      return (
        this.settingId && this.node &&this.specs && Object.keys(this.specs).length
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
  }
}
</script>

<style>
.sidebar {
  padding: 0 20px;
}
</style>
