<script>
import InheritanceController from '@/components/TemplateUtils/InheritanceController'
import ControllerLayer from '@/components/TemplateUtils/ControllerLayer'
import AsyncComponent from '@/components/TemplateUtils/AsyncComponent'
import { ObserveVisibility } from 'vue-observe-visibility'
import {
  getNode,
  isComponentSet,
  isGrid,
  isGridItem,
  isLayers
} from '@/utils/node'
import { canInherit } from '@/utils/inheritance'
import { getValueByPath } from '@/utils/tool'
import { mapState } from 'vuex'
import { arrayFirst } from '@/utils/array'

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
    fitContainer: {
      type: Boolean,
      default: false
    },
    controller: {
      type: Boolean,
      default: true
    }
  },
  data() {
    // draftMode因為css & setting需要拿vm，不打開拿不到
    const node = getNode(this.id)

    const options = {
      once: this.onceObserve && !this.isExample,
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

    return {
      vIf: isComponentSet(
        getValueByPath(node, 'parentNode.parentNode.parentNode')
      ),
      options
    }
  },
  created() {
    if (!this.isExample && this.isDraftMode) {
      this.vIf = true
      this.options = false
    }
  },
  computed: {
    ...mapState('layout', ['breakpoint']),
    visible() {
      const hidden =
        this.node && this.node.hidden && this.node.hidden[this.breakpoint]
      return this.node && !hidden
    },
    node() {
      return getNode(this.id)
    },
    isLayers() {
      return isLayers(this.node)
    },
    isPossibleInherit() {
      // no matter the master is softDelete or not
      return getValueByPath(this.node, 'inheritance.isInstanceParent')
    },
    isGridItem() {
      return isGridItem(this.node)
    },
    isGrid() {
      return isGrid(this.node)
    }
  },
  render(h) {
    if (!this.visible) {
      return
    }
    let vnode = null

    if (!this.controller || this.isGrid || this.isLayers) {
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

    if (this.isPossibleInherit) {
      vnode = h(
        InheritanceController,
        {
          props: {
            id: this.id
          }
        },
        [vnode]
      )
    }
    return vnode
  }
}
</script>

<style scoped lang="scss"></style>
