<template>
  <div class="settings">
    <template v-if="canInteract">
      <el-divider content-position="left">
        INTERACTION
      </el-divider>

      <setting-grid-generator-item :id="lastNode.id" />
    </template>

    <template v-if="canSetUp">
      <el-divider content-position="left">
        SETTINGS
      </el-divider>

      <component
        v-if="lastNode"
        :is="vueComponentTag"
        :key="lastNode.id"
        :id="lastNode.id"
        class="m-t-10"
      />
    </template>

    <div
      v-else-if="!canInteract && !canSetUp"
      class="flex-center h-100"
    >
      <p class="small-title gray-font-2">No Settings</p>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { bigCamelCase } from '@/utils/string'
import { arrayLast, arrayUniq } from '@/utils/array'
import { vmGet } from '@/utils/vmMap'
import { isBackground, isCarousel, isGroup, isSlider } from '@/utils/node'

const self = {
  name: 'PanelSettings',
  components: {
    // SettingDrawer: () => import('./EditorSetting/SettingDrawer'),

    SettingFlexButton: () => import('./EditorSetting/SettingFlexButton'),
    SettingFlexImage: () => import('./EditorSetting/SettingFlexImage'),
    // SettingGridGenerator: () => import('./EditorSetting/SettingGridGenerator'),
    SettingGridGeneratorItem: () =>
      import('./EditorSetting/SettingGridGeneratorItem'),
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
    isBackground() {
      return isBackground(this.lastNode)
    },
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
    canInteract() {
      return !this.selectedComponentNodes.some(node => {
        return isCarousel(node) || isBackground(node) || isSlider(node)
      })
    },
    canSetUp() {
      return this.areSameTag && this.hasVueSettingComponent && this.vm && !this.isBackground
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
