import { cloneJson, deepMerge } from '@/utils/tool'
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
  methods: {
    ...mapMutations('layout', {
      LAYOUT_SET: 'SET'
    })
  }
}
