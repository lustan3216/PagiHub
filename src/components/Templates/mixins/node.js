import { mapState } from 'vuex'
import { vmAppend, vmRemove } from '@/utils/vmMap'
import { objectAssign, cloneJson } from '@/utils/tool'
import { PROPS, VALUE, GRID, MASTER_ID, ID, STYLE } from '@/const'
import FreeStyle from '@/directive/freeStyle'
import { getNode } from '@/utils/node'

let hoverNode = []

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  inject: {
    isExample: { default: false },
    rootComponentSetId: { default: null }
  },
  directives: {
    FreeStyle
  },
  data() {
    return {
      masterStyles: {},
      selfStyles: {},
      masterProps: {},
      selfProps: {}
    }
  },
  computed: {
    ...mapState('example', ['basicExamplesMap']),
    node() {
      return getNode(this[ID])
    },
    innerValue() {
      return this.node && this.node[VALUE]
    },
    masterId() {
      return this.node && this.node[MASTER_ID]
    },
    innerStyles() {
      return {
        id: this.id,
        ...objectAssign(this.masterStyles, this.selfStyles)
      }
    },
    innerProps() {
      const setting = cloneJson(this.$options.defaultSetting || {})
      return objectAssign(setting, this.masterProps, this.selfProps)
    },
    currentMapString() {
      return this.isExample ? 'basicExamplesMap' : 'componentsMap'
    }
  },
  created() {
    this.watchStyles()
    this.watchProps()

    if (this.masterId) {
      this.watchMasterStyles()
      this.watchMasterProps()
    }
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
    watch(path, fn) {
      this.$watch(path, fn, { deep: true, immediate: true })
    },
    watchStyles() {
      const path = `${this.currentMapString}.${this.id}.${STYLE}`
      this.watch(path, value => {
        this.selfStyles = value || {}
      })
    },
    watchMasterStyles() {
      const path = `${this.currentMapString}.${this.masterId}.${STYLE}`
      this.watch(path, value => {
        this.masterStyles = value || {}
      })
    },
    watchProps() {
      const path = `${this.currentMapString}.${this.id}.${PROPS}`
      this.watch(path, value => {
        this.selfProps = value || {}
      })
    },
    watchMasterProps() {
      const path = `${this.currentMapString}.${this.masterId}.${PROPS}`
      this.watch(path, value => {
        this.masterProps = value || {}
      })
    },
    hoverCover(hover) {
      if (!this.node) {
        return
      }

      const $el = this.node.tag === GRID ? this.$el : this.$el.parentNode

      if (hover) {
        const node = document.createElement('DIV')
        node.className = 'hover-cover'
        $el.appendChild(node)
        hoverNode.push(node)
      }
      else {
        hoverNode.forEach(x => x.remove())
        hoverNode = []
      }
    }
  }
}
