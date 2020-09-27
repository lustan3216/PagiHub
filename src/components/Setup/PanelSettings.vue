<template>
  <div class="h-100">
    <component
      v-if="canSetUp"
      :is="vueComponentTag"
      :id="lastNode.id"
      class="m-t-10 settings"
    />
    <div
      v-else
      class="h-100 flex-center"
    >
      <p class="small-title">No Settings</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { bigCamelCase } from '@/utils/string'
import { arrayLast, arrayUniq } from '@/utils/array'

const self = {
  name: 'PanelSettings',
  components: {
    // SettingDrawer: () => import('./EditorSetting/SettingDrawer'),

    SettingFlexButton: () => import('./EditorSetting/SettingFlexButton'),
    SettingFlexImage: () => import('./EditorSetting/SettingFlexImage'),
    // SettingGridGenerator: () => import('./EditorSetting/SettingGridGenerator'),
    // SettingGridItem: () => import('./EditorSetting/SettingGridItem'),
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
    hasVueSettingComponent() {
      // 有些component沒有設定，就不做vue component了，所以這裡要檢查
      return this.lastNode && Boolean(self.components[this.vueComponentTag])
    },
    vueComponentTag() {
      if (this.lastNode) {
        return `Setting${bigCamelCase(this.lastNode.tag)}`
      }
    },
    areSameTag() {
      const tags = this.selectedComponentNodes.map(node => node.tag)
      return arrayUniq(tags).length === 1
    },
    canSetUp() {
      return this.areSameTag && this.hasVueSettingComponent
    }
  }
}

export default self
</script>

<style scoped lang="scss">
::v-deep.settings {
  .el-col.el-col-24 {
    margin-bottom: 15px;
  }
  .el-form-item {
    display: flex;
  }
  .el-form-item__content {
    margin-left: 0 !important;
  }
  .el-form-item__label {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
