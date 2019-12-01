<template>
  <flex-sidebar v-if="canShowSetting" class="sidebar">
    <div v-for="(object, key) in settings">
      <h3>{{ key }}</h3>
      <form-create
        :rule="Object.values(object)"
        :asd="Object.values(object)"
        :option="option"
      />
    </div>
  </flex-sidebar>
</template>

<script>
import { vmMap } from '../../utils/vmMap'
import globalStatus from '../../observable/globalStatus'
import FlexSidebar from '../Templates/FlexSidebar'
import formCreate from '@form-create/element-ui'

export default {
  name: 'SidebarSettings',
  components: {
    FlexSidebar,
    FormCreate: formCreate.$form()
  },
  data() {
    return {
      option: {
        submitBtn: { show: false },
        form: { size: 'mini' },
        info: { type: 'tooltip' }
      }
    }
  },
  computed: {
    canShowSetting() {
      return (
        this.settingId && this.settings && Object.keys(this.settings).length
      )
    },
    settings() {
      if (!this.vm) return
      const settings = this.vm.settings
      this.insertOnChange(settings)
      return settings
    },
    settingId() {
      return globalStatus.settingId
    },
    vm() {
      return vmMap[this.settingId]
    }
  },
  methods: {
    insertOnChange(_settings) {
      debugger
      for (const [_key, settings] of Object.entries(_settings)) {
        for (const [key, _value] of Object.entries(settings)) {
          _value.on = {
            change: value => this.vm.setSetting({ [_key]: { [key]: value }})
          }
        }
      }
    }
  }
}
</script>

<style>
.sidebar {
  padding: 0 20px;
}
</style>
