<template>
  <component
    v-if="theOnlySelectedComponentId && hasComponent"
    :is="componentTag"
    :id="theOnlySelectedComponentId"
  />
</template>

<script>
import { mapGetters } from 'vuex'

const self = {
  name: 'PanelSettings',
  components: {
    SettingCard: () => import('./EditorSetting/SettingCard'),
    SettingDrawer: () => import('./EditorSetting/SettingDrawer'),
    SettingFlexButton: () => import('./EditorSetting/SettingFlexButton'),
    SettingFlexImage: () => import('./EditorSetting/SettingFlexImage'),
    SettingGridGenerator: () => import('./EditorSetting/SettingGridGenerator'),
    SettingGridItem: () => import('./EditorSetting/SettingGridItem'),
    SettingVideoPlayer: () => import('./EditorSetting/SettingVideoPlayer'),

    SettingFormGenerator: () => import('./EditorSetting/SettingFormGenerator'),
    SettingFormCheckbox: () => import('./EditorSetting/SettingFormCheckbox'),
    SettingFormColorPicker: () =>
      import('./EditorSetting/SettingFormColorPicker'),
    SettingFormDatePicker: () =>
      import('./EditorSetting/SettingFormDatePicker'),
    SettingFormInput: () => import('./EditorSetting/SettingFormInput'),
    SettingFormNumber: () => import('./EditorSetting/SettingFormNumber'),
    SettingFormRadio: () => import('./EditorSetting/SettingFormRadio'),
    SettingFormRate: () => import('./EditorSetting/SettingFormRate'),
    SettingFormSelect: () => import('./EditorSetting/SettingFormSelect'),
    SettingFormSlider: () => import('./EditorSetting/SettingFormSlider'),
    SettingFormSwitch: () => import('./EditorSetting/SettingFormSwitch'),
    SettingFormTextarea: () => import('./EditorSetting/SettingFormTextarea'),
    SettingFormTimePicker: () => import('./EditorSetting/SettingFormTimePicker')
  },
  computed: {
    ...mapGetters('app', [
      'selectedComponentNode',
      'theOnlySelectedComponentId'
    ]),
    hasComponent() {
      return self.components[this.componentTag]
    },
    componentTag() {
      return `Setting${this.selectedComponentNode.tag.bigCamelCase()}`
    }
  }
}

export default self
</script>
