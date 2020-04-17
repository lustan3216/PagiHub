<template>
  <component
    :is="tag"
    :id="id"
  />
</template>

<script>
export default {
  name: 'LazyLoadComponent',
  components: {
    FlexImage: () => import('../Templates/FlexImage'),
    FlexButton: () => import('../Templates/FlexButton'),

    Carousel: () => import('../Templates/Carousel'),
    EditorText: () => import('../Templates/EditorText'),
    GridGenerator: () => import('../Templates/GridGenerator'),

    Divider: () => import('../Templates/Divider'),
    VideoPlayer: () => import('../Templates/VideoPlayer'),
    Layers: () => import('../Templates/Layers'),
    Card: () => import('../Templates/Card'),
    Drawer: () => import('../Templates/Drawer'),

    FormGenerator: () => import('../Templates/FormGenerator'),
    FormTextarea: () => import('../Templates/FormTextarea'),
    FormColorPicker: () => import('../Templates/FormColorPicker'),
    FormCheckbox: () => import('../Templates/FormCheckbox'),
    FormDatePicker: () => import('../Templates/FormDatePicker'),
    FormInput: () => import('../Templates/FormInput'),
    FormLabel: () => import('../Templates/FormLabel'),
    FormNumber: () => import('../Templates/FormNumber'),
    FormRadio: () => import('../Templates/FormRadio'),
    FormRate: () => import('../Templates/FormRate'),
    FormReset: () => import('../Templates/FormReset'),
    FormSelect: () => import('../Templates/FormSelect'),
    FormSlider: () => import('../Templates/FormSlider'),
    FormSubmit: () => import('../Templates/FormSubmit'),
    FormSwitch: () => import('../Templates/FormSwitch'),
    FormTimePicker: () => import('../Templates/FormTimePicker')
  },
  props: {
    tag: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  }
}
</script>
