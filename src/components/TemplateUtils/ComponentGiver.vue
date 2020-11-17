<script>
import { isGridItem } from '@/utils/node'
import { getValueByPath } from '@/utils/tool'
import { mapState } from 'vuex'
import { STYLES } from '@/const'

export default {
  name: 'ComponentGiver',
  inject: {
    isExample: { default: false }
  },
  components: {
    Group: () => import('../Templates/Group'),
    Rectangle: () => import('../Templates/Rectangle'),
    ComponentSet: () => import('../Templates/ComponentSet'),
    FlexImage: () => import('../Templates/FlexImage'),
    FlexButton: () => import('../Templates/FlexButton'),

    Carousel: () => import('../Templates/Carousel'),
    TextEditor: () => import('../Templates/TextEditor'),

    Background: () => import('../Templates/Background'),

    VideoPlayer: () => import('../Templates/VideoPlayer'),
    Iframer: () => import('../Templates/Iframer')

    // FormTextarea: () => import('../Templates/FormTextarea'),
    // FormColorPicker: () => import('../Templates/FormColorPicker'),
    // FormCheckbox: () => import('../Templates/FormCheckbox'),
    // FormDatePicker: () => import('../Templates/FormDatePicker'),
    // FormInput: () => import('../Templates/FormInput'),
    // FormNumber: () => import('../Templates/FormNumber'),
    // FormRadio: () => import('../Templates/FormRadio'),
    // FormRate: () => import('../Templates/FormRate'),
    // FormSelect: () => import('../Templates/FormSelect'),
    // FormSlider: () => import('../Templates/FormSlider'),
    // FormSubmit: () => import('../Templates/FormSubmit'),
    // FormSwitch: () => import('../Templates/FormSwitch'),
    // FormTimePicker: () => import('../Templates/FormTimePicker')
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState('layout', ['currentBreakpoint']),
    visible() {
      return this.node && !this.hidden
    },
    node() {
      return this.nodesMap[this.id]
    },
    isGridItem() {
      return isGridItem(this.node)
    },
    hidden() {
      return getValueByPath(this.node, [
        STYLES,
        this.currentBreakpoint,
        'hidden'
      ])
    }
  },
  render(h) {
    if (!this.visible) {
      return
    }

    return h(this.node.tag, {
      key: this.id,
      props: {
        id: this.id
      }
    })
  }
}
</script>

<style scoped lang="scss"></style>
