<template>
  <div>
    <node-info
      v-if="theOnlySelectedComponentId"
      :id="theOnlySelectedComponentId"
      class="text-center m-b-10 block"
      show-family
    />

    <component
      v-if="theOnlySelectedComponentId && hasComponent"
      :is="componentTag"
      :id="theOnlySelectedComponentId"
      class="p-r-10"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NodeInfo from '@/components/TemplateUtils/NodeInfo'

const self = {
  name: 'PanelSettings',
  components: {
    NodeInfo,
    SettingCard: () => import('./EditorSetting/SettingCard'),
    SettingDrawer: () => import('./EditorSetting/SettingDrawer'),
    SettingDivider: () => import('./EditorSetting/SettingDivider'),
    SettingFlexButton: () => import('./EditorSetting/SettingFlexButton'),
    SettingFlexImage: () => import('./EditorSetting/SettingFlexImage'),
    SettingGridGenerator: () => import('./EditorSetting/SettingGridGenerator'),
    SettingGridItem: () => import('./EditorSetting/SettingGridItem'),
    SettingVideoPlayer: () => import('./EditorSetting/SettingVideoPlayer'),
    SettingCarousel: () => import('./EditorSetting/SettingCarousel'),

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

<style scoped lang="scss">
::v-deep .el-form-item {
  margin-bottom: 8px;
}
</style>
