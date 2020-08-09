<template>
  <div
    v-observe-visibility="options"
    v-if="isExample || isLayers"
  >
    <component
      v-if="vIf"
      :is="tag"
      :id="id"
      :key="id"
    />
  </div>

  <!--  should have observe-visibility here, otherwise some nested layout case, the grid layout will not work right-->
  <controller-layer
    v-observe-visibility="options"
    v-else
    :id="id"
    :border="false"
  >
    <!--  it will has a bug here if component without key like, editorText -->
    <template v-slot="{ itemEditing }">
      <!--  it will has a bug here if component without key like, editorText -->
      <!--  editing 給 texteditor 用的  -->
      <component
        v-if="vIf"
        :editing="itemEditing"
        :is="tag"
        :id="id"
        :key="id"
        :class="{ 'no-action': !itemEditing, 'grid-item-fix': itemEditing }"
      />
    </template>
  </controller-layer>
</template>

<script>
import { ObserveVisibility } from 'vue-observe-visibility'
import { isComponentSet, getNode, isLayers } from '@/utils/node'
import { COMPONENT_SET } from '@/const'

export default {
  name: 'AsyncComponent',
  directives: {
    ObserveVisibility
  },
  inject: {
    isExample: { default: false }
  },
  components: {
    ControllerLayer: () => import('./ControllerLayer'),
    ComponentSet: () => import('./ComponentSet'),

    FlexImage: () => import('../Templates/FlexImage'),
    FlexButton: () => import('../Templates/FlexButton'),

    Carousel: () => import('../Templates/Carousel'),
    TextEditor: () => import('../Templates/TextEditor'),
    GridGenerator: () => import('../Templates/GridGenerator'),
    GridGeneratorInner: () => import('../Templates/GridGeneratorInner'),

    Divider: () => import('../Templates/Divider'),
    VideoPlayer: () => import('../Templates/VideoPlayer'),
    Layers: () => import('../Templates/Layers'),
    Drawer: () => import('../Templates/Drawer'),

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
    onceObserve: {
      type: Boolean,
      default: true
    }
  },
  data() {
    // draftMode因為css & setting需要拿vm，不打開拿不到
    return {
      vIf: false,
      options: {
        callback: isVisible => {
          if (this.onceObserve) {
            if (isVisible) {
              this.vIf = isVisible
              this.options = false
            }
          } else {
            this.vIf = isVisible
          }
        },
        intersection: {
          rootMargin: '50px 0px'
        }
      }
    }
  },
  computed: {
    node() {
      return getNode(this.id, this.isExample)
    },
    tag() {
      if (isComponentSet(this.node)) {
        return COMPONENT_SET
      } else {
        return this.node.tag
      }
    },
    isLayers() {
      return isLayers(this.node)
    }
  }
}
</script>
