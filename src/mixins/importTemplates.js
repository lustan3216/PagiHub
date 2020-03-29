export default {
  components: {
    FlexImage: () => import('../components/Templates/FlexImage'),
    FlexButton: () => import('../components/Templates/FlexButton'),

    Carousel: () => import('../components/Templates/Carousel'),
    EditorText: () => import('../components/Templates/EditorText'),
    GridGenerator: () => import('../components/Templates/GridGenerator'),

    Divider: () => import('../components/Templates/Divider'),
    VideoPlayer: () => import('../components/Templates/VideoPlayer'),
    Layers: () => import('../components/Templates/Layers'),
    Card: () => import('../components/Templates/Card'),
    Drawer: () => import('../components/Templates/Drawer'),

    FormGenerator: () => import('../components/Templates/Form/FormGenerator'),
    FormTextarea: () => import('../components/Templates/Form/FormTextarea'),
    FormColorPicker: () =>
      import('../components/Templates/Form/FormColorPicker'),
    FormCheckbox: () => import('../components/Templates/Form/FormCheckbox'),
    FormDatePicker: () => import('../components/Templates/Form/FormDatePicker'),
    FormInput: () => import('../components/Templates/Form/FormInput'),
    FormLabel: () => import('../components/Templates/Form/FormLabel'),
    FormNumber: () => import('../components/Templates/Form/FormNumber'),
    FormRadio: () => import('../components/Templates/Form/FormRadio'),
    FormRate: () => import('../components/Templates/Form/FormRate'),
    FormReset: () => import('../components/Templates/Form/FormReset'),
    FormSelect: () => import('../components/Templates/Form/FormSelect'),
    FormSlider: () => import('../components/Templates/Form/FormSlider'),
    FormSubmit: () => import('../components/Templates/Form/FormSubmit'),
    FormSwitch: () => import('../components/Templates/Form/FormSwitch'),
    FormTimePicker: () => import('../components/Templates/Form/FormTimePicker')
  }
}
