import { mapGetters, mapMutations, mapState } from 'vuex'
import { vmAppend, vmRemove } from '@/utils/vmMap'
import { deepmerge, cloneJson } from '@/utils/tool'
import { STYLE, PROPS, VALUE, GRID_GENERATOR } from '@/const'
import style from '@/directive/style'
import { directive } from '@/directive/freeStyle'

let hoverNode = []

export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  inject: {
    isExample: { default: false }
  },
  directives: {
    style,
    freeStyle: directive
  },
  data() {
    return {
      innerStyles: {},
      innerProps: {}
    }
  },
  computed: {
    ...mapState('draft', ['nodesMap']),
    node() {
      return this.nodesMap[this.id]
    },
    innerValue() {
      return this.node && this.node[VALUE]
    }
  },
  created() {
    this.$watch(`nodesMap.${this.id}.${STYLE}`, value => {
      this.innerStyles = {
        id: this.id,
        ...value
      }
    }, { deep: true, immediate: true })

    this.$watch(`nodesMap.${this.id}.${PROPS}`, value => {
      const setting = cloneJson(this.$options.defaultSetting || {})
      this.innerProps = deepmerge(setting, value || {})
    }, { deep: true, immediate: true })
  },
  mounted() {
    // Don't put in created to prevent some component fail before mount
    if (this.isDraftMode && !this.isExample) {
      vmAppend(this)
      this.$bus.$on(`hover-${this.id}`, this.hoverCover)
    }
  },
  beforeDestroy() {
    if (this.isDraftMode && !this.isExample) {
      vmRemove(this.id)
      this.$bus.$off(`hover-${this.id}`, this.hoverCover)
    }
  },
  methods: {
    ...mapMutations('app', ['CLEAN_SELECTED_COMPONENT_IDS']),
    hoverCover(hover) {
      const $el =
        this.node.tag === GRID_GENERATOR ? this.$el : this.$el.parentNode

      if (hover) {
        const node = document.createElement('DIV')
        node.className = 'hover-cover'
        $el.appendChild(node)
        hoverNode.push(node)
      } else {
        hoverNode.forEach(x => x.remove())
        hoverNode = []
      }
    }
  }
}
