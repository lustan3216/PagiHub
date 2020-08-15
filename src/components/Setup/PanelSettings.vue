<template>
  <component
    v-if="canSetUp"
    :is="vueComponentTag"
    :id="lastNode.id"
    class="p-r-10"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import { bigCamelCase } from '@/utils/string'
import { arrayLast, arrayUniq } from '@/utils/tool'

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
    SettingIframer: () => import('./EditorSetting/SettingIframer'),

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
    ...mapGetters('app', ['selectedComponentNodes']),
    lastNode() {
      return arrayLast(this.selectedComponentNodes)
    },
    hasVueComponent() {
      // 有些component沒有設定，就不做vue component了，所以這裡要檢查
      return this.lastNode && Boolean(self.components[this.vueComponentTag])
    },
    vueComponentTag() {
      return `Setting${bigCamelCase(this.lastNode.tag)}`
    },
    areSameTag() {
      const tags = this.selectedComponentNodes.map(node => node.tag)
      return arrayUniq(tags).length === 1
    },
    canSetUp() {
      console.log(this.areSameTag && this.hasVueComponent)
      return this.areSameTag && this.hasVueComponent
    }
  }
}

export default self
</script>
