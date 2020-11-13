import { cloneJson, deepMerge, globalDebounce } from '@/utils/tool'
import { PROPS, VALUE, STYLES } from '@/const'
import { mapMutations } from 'vuex'

export default {
  props: {
    id: {
      type: String
    }
  },
  inject: {
    isExample: { default: false }
  },
  computed: {
    node() {
      return this.nodesMap[this.id]
    },
    innerValue() {
      return this.node[VALUE]
    },
    innerStyles() {
      return this.node[STYLES] || {}
    },
    innerProps() {
      const setting = cloneJson(this.$options.defaultSetting || {})
      return deepMerge(setting, this.node[PROPS])
    }
  },
  watch: {
    innerStyles: {
      handler() {
        this.LAYOUT_SET({ gridResizing: true })
        globalDebounce(() => {
          this.LAYOUT_SET({ gridResizing: false })
        }, 1500)
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('layout', {
      LAYOUT_SET: 'SET'
    })
  }
}
