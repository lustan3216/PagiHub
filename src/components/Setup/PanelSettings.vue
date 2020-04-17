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
    Card: () => import('./EditorSetting/Card'),
    Drawer: () => import('./EditorSetting/Drawer'),
    FlexButton: () => import('./EditorSetting/FlexButton'),
    FlexImage: () => import('./EditorSetting/FlexImage'),
    GridGenerator: () => import('./EditorSetting/GridGenerator'),
    GridItem: () => import('./EditorSetting/GridItem'),
    VideoPlayer: () => import('./EditorSetting/VideoPlayer'),

    FormGenerator: () => import('./EditorSetting/FormGenerator'),
    FormCheckbox: () => import('./EditorSetting/FormCheckbox'),
    FormColorPicker: () => import('./EditorSetting/FormColorPicker'),
    FormDatePicker: () => import('./EditorSetting/FormDatePicker'),
    FormInput: () => import('./EditorSetting/FormInput'),
    FormNumber: () => import('./EditorSetting/FormNumber'),
    FormRadio: () => import('./EditorSetting/FormRadio'),
    FormRate: () => import('./EditorSetting/FormRate'),
    FormSelect: () => import('./EditorSetting/FormSelect'),
    FormSlider: () => import('./EditorSetting/FormSlider'),
    FormSwitch: () => import('./EditorSetting/FormSwitch'),
    FormTextarea: () => import('./EditorSetting/FormTextarea'),
    FormTimePicker: () => import('./EditorSetting/FormTimePicker')
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
      return this.selectedComponentNode.tag.bigCamelCase()
    }
  }
}

export default self
</script>
