<script>
import ControllerLayer from '@/components/TemplateUtils/ControllerLayer'
import AsyncComponent from '@/components/TemplateUtils/AsyncComponent'
import { ObserveVisibility } from 'vue-observe-visibility'
import { isComponentSet, isGrid, isGridItem } from '@/utils/node'
import { getValueByPath } from '@/utils/tool'
import { mapGetters, mapState } from 'vuex'
import { STYLES } from '@/const'

export default {
  name: 'ComponentGiver',
  inject: {
    isExample: { default: false }
  },
  directives: {
    ObserveVisibility
  },
  props: {
    id: {
      type: String,
      required: true
    },
    onceObserve: {
      type: Boolean,
      default: true
    },
    controller: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      vIf: false,
      options: null
    }
  },
  created() {
    if (!this.isExample && this.isDraftMode) {
      this.vIf = true
      this.options = false
    }
    else {
      const node = this.nodesMap[this.id]

      const options = {
        once: this.onceObserve || this.isExample,
        callback: isVisible => {
          this.vIf = isVisible
        },
        intersection: {
          root: this.isExample
            ? document.getElementById(`example-${node.rootComponentSetId}`)
            : document.getElementById('art-board'),
          rootMargin: '300px 0px 0px 300px'
        }
      }

      const thirdLayer = getValueByPath(
        node,
        'parentNode.parentNode.parentNode'
      )
      const isThirdLayer = isComponentSet(thirdLayer)

      this.vIf = !isThirdLayer
      this.options = isThirdLayer ? options : false
    }
  },
  computed: {
    ...mapGetters('layout', ['currentBreakpoint']),
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
    let vnode = null

    if (!this.controller || isGrid(this.node)) {
      vnode = h(AsyncComponent, {
        props: {
          id: this.id
        }
      })
    }
    else {
      const scopedSlots = {}

      if (this.vIf) {
        scopedSlots.default = ref => {
          return h(AsyncComponent, {
            props: {
              id: this.id,
              editing: ref.itemEditing
            }
          })
        }
      }

      vnode = h(ControllerLayer, {
        attrs: { id: this.id },
        directives: [
          {
            name: 'observe-visibility',
            value: this.options
          }
        ],
        scopedSlots
      })
    }

    return vnode
  }
}
</script>

<style scoped lang="scss"></style>
