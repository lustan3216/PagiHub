<template>
  <component
    v-if="node"
    :is="node.tag"
    :id="id"
    :editing="editing"
  />
</template>

<script>
import { getNode } from '@/utils/node'

export default {
  name: 'AsyncComponent',
  inject: {
    isExample: { default: false }
  },
  components: {
    ComponentSet: () => import('../Templates/ComponentSet'),
    FlexImage: () => import('../Templates/FlexImage'),
    FlexButton: () => import('../Templates/FlexButton'),

    Carousel: () => import('../Templates/Carousel'),
    TextEditor: () => import('../Templates/TextEditor'),

    GridGenerator: () => import('../Templates/GridGenerator'),
    GridGeneratorItem: () => import('../Templates/GridGeneratorItem'),

    VideoPlayer: () => import('../Templates/VideoPlayer'),
    Drawer: () => import('../Templates/Drawer'),
    Iframer: () => import('../Templates/Iframer'),

    FormTextarea: () => import('../Templates/FormTextarea'),
    FormColorPicker: () => import('../Templates/FormColorPicker'),
    FormCheckbox: () => import('../Templates/FormCheckbox'),
    FormDatePicker: () => import('../Templates/FormDatePicker'),
    FormInput: () => import('../Templates/FormInput'),
    FormNumber: () => import('../Templates/FormNumber'),
    FormRadio: () => import('../Templates/FormRadio'),
    FormRate: () => import('../Templates/FormRate'),
    FormSelect: () => import('../Templates/FormSelect'),
    FormSlider: () => import('../Templates/FormSlider'),
    FormSubmit: () => import('../Templates/FormSubmit'),
    FormSwitch: () => import('../Templates/FormSwitch'),
    FormTimePicker: () => import('../Templates/FormTimePicker')
  },
  props: {
    id: {
      type: String,
      required: true
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    node() {
      return getNode(this.id, this.isExample)
    }
  }
}
</script>
