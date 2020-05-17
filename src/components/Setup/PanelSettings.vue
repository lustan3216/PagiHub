<template>
  <component
    v-if="theOnlySelectedComponentId && hasComponent"
    :is="componentTag"
    :id="theOnlySelectedComponentId"
    class="p-r-10"
  />
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { bigCamelCase } from '@/utils/string'

const self = {
  name: 'PanelSettings',
  components: {
    SettingDrawer: () => import('./EditorSetting/SettingDrawer'),
    SettingDivider: () => import('./EditorSetting/SettingDivider'),
    SettingFlexButton: () => import('./EditorSetting/SettingFlexButton'),
    SettingFlexImage: () => import('./EditorSetting/SettingFlexImage'),
    SettingGridGenerator: () => import('./EditorSetting/SettingGridGenerator'),
    SettingGridItem: () => import('./EditorSetting/SettingGridItem'),
    SettingVideoPlayer: () => import('./EditorSetting/SettingVideoPlayer'),
    SettingCarousel: () => import('./EditorSetting/SettingCarousel'),

    SettingFormSubmit: () => import('./EditorSetting/SettingFormSubmit'),
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
    ...mapState('app', ['selectedComponentIds']),
    ...mapState('component', ['componentsMap']),
    ...mapGetters('app', [
      'selectedComponentNode',
      'theOnlySelectedComponentId'
    ]),
    allSameTag() {
      let same = true
      for (let i = 0; i < this.selectedComponentIds.length - 1; i++) {
        const id = this.selectedComponentIds[i]
        const nextId = this.selectedComponentIds[i + 1]
        if (this.componentsMap[id].tag !== this.componentsMap[nextId].tag) {
          same = false
          break
        }
      }

      return same && this.selectedComponentIds.length
    },
    hasComponent() {
      return self.components[this.componentTag]
    },
    componentTag() {
      return `Setting${bigCamelCase(this.selectedComponentNode.tag)}`
    }
  }
}

export default self
</script>
