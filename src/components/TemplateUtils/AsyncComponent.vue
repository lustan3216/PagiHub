<template>
  <!-- v-observe-visibility 跟vIf 一定要不同層，不然v-if false 的話沒辦法observer -->
  <div
    v-observe-visibility="options"
    v-if="visible && isLayers"
    class="h-100"
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
    v-else-if="visible"
    :id="id"
    :class="{ 'h-100': !isTextEditor }"
  >
    <template v-slot="{ itemEditing }">
      <!--  it will has a bug here if component without key like, editorText -->
      <!--  editing 給 texteditor 用的  -->
      <component
        v-if="vIf"
        ref="component"
        :editing="itemEditing"
        :is="tag"
        :id="id"
        :key="id"
      />
    </template>
  </controller-layer>
</template>

<script>
import { ObserveVisibility } from 'vue-observe-visibility'
import { isLayers, isGridItem, isGrid, getNode } from '@/utils/node'
import { CAN_BE_EDITED } from '@/const'
import { mapState } from 'vuex'

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
    ComponentSet: () => import('../Templates/ComponentSet'),
    FlexImage: () => import('../Templates/FlexImage'),
    FlexButton: () => import('../Templates/FlexButton'),

    Carousel: () => import('../Templates/Carousel'),
    TextEditor: () => import('../Templates/TextEditor'),
    GridGenerator: () => import('../Templates/GridGenerator'),
    GridGeneratorItem: () => import('../Templates/GridGeneratorItem'),

    // Divider: () => import('../Templates/Divider'),
    VideoPlayer: () => import('../Templates/VideoPlayer'),
    Layers: require('../Templates/Layers').default,
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
    onceObserve: {
      type: Boolean,
      default: true
    }
  },
  data() {
    // draftMode因為css & setting需要拿vm，不打開拿不到
    const node = getNode(this.id)
    let noObserve = false

    let options = {
      once: this.onceObserve,
      callback: isVisible => {
        this.vIf = isVisible
      },
      intersection: {
        rootMargin: '100px'
      }
    }

    if (isGridItem(node) || isGrid(node) || isLayers(node)) {
      noObserve = true
      options = false
    }

    return {
      vIf: noObserve,
      options
    }
  },
  computed: {
    ...mapState('app', ['breakpoint']),
    visible() {
      const hidden =
        this.node && this.node.hidden && this.node.hidden[this.breakpoint]
      return this.node && !hidden
    },
    node() {
      return getNode(this.id)
    },
    canBeEdited() {
      return this.node[CAN_BE_EDITED]
    },
    tag() {
      if (!this.node) {
        return
      }

      return this.node.tag
    },
    isLayers() {
      return isLayers(this.node)
    },
    isGrid() {
      return isGrid(this.node)
    },
    isGridItem() {
      return isGridItem(this.node)
    },
    isTextEditor() {
      return this.node.tag === 'text-editor'
    }
  }
}
</script>
