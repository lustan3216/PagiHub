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

    FormGenerator: () => import('../Templates/Form/FormGenerator'),
    FormTextarea: () => import('../Templates/Form/FormTextarea'),
    FormColorPicker: () => import('../Templates/Form/FormColorPicker'),
    FormCheckbox: () => import('../Templates/Form/FormCheckbox'),
    FormDatePicker: () => import('../Templates/Form/FormDatePicker'),
    FormInput: () => import('../Templates/Form/FormInput'),
    FormLabel: () => import('../Templates/Form/FormLabel'),
    FormNumber: () => import('../Templates/Form/FormNumber'),
    FormRadio: () => import('../Templates/Form/FormRadio'),
    FormRate: () => import('../Templates/Form/FormRate'),
    FormReset: () => import('../Templates/Form/FormReset'),
    FormSelect: () => import('../Templates/Form/FormSelect'),
    FormSlider: () => import('../Templates/Form/FormSlider'),
    FormSubmit: () => import('../Templates/Form/FormSubmit'),
    FormSwitch: () => import('../Templates/Form/FormSwitch'),
    FormTimePicker: () => import('../Templates/Form/FormTimePicker')
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
