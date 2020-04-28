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
import { mapGetters, mapState } from 'vuex'
import { bigCamelCase } from '@/utils/string'
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
    ...mapState('draft', ['nodesMap']),
    ...mapGetters('app', [
      'selectedComponentNode',
      'theOnlySelectedComponentId'
    ]),
    allSameTag() {
      let same = true
      for (let i = 0; i < this.selectedComponentIds.length - 1; i++) {
        const id = this.selectedComponentIds[i]
        const nextId = this.selectedComponentIds[i + 1]
        if (this.nodesMap[id].tag !== this.nodesMap[nextId].tag) {
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
    },
    asd() {
      return this.selectedComponentIds
    }
  }
}

export default self
</script>

<style scoped lang="scss">
::v-deep {
  .el-form-item {
    margin-bottom: 8px;
  }
  h4 {
    margin: 5px 0;
  }
}
</style>
