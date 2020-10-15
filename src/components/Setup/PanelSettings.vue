<template>
  <div v-if="canSetUp">
    <el-divider content-position="left">
      SETTINGS
    </el-divider>

    <keep-alive>
      <component
        :is="vueComponentTag"
        :key="vueComponentTag"
        :id="lastNode.id"
        class="m-t-10 settings"
      />
    </keep-alive>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { bigCamelCase } from '@/utils/string'
import { arrayLast, arrayUniq } from '@/utils/array'
import { vmGet } from '@/utils/vmMap'

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
      return this.areSameTag && this.hasVueSettingComponent && this.vm
    },
    vm() {
      return vmGet(this.lastNode.id) // when selecting component in example
    }
  }
}

export default self
</script>

<style scoped lang="scss">
::v-deep.settings {
  .el-col.el-col-24 {
    margin-bottom: 10px;
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
    line-height: 14px;
  }

  .el-checkbox {
    .el-checkbox__input {
      line-height: 0;
    }
    .el-checkbox__label {
      display: none;
    }
  }
}
</style>
