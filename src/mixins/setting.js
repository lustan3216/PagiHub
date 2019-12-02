import clone from 'clone'
import store from '../store'
import { mapMutations } from 'vuex'
import { merge } from '../lodash'

export default {
  data() {
    const node = store.state.nodes.currentNodesMap[this.id]
    return {
      innerSettings: (node && clone(node.props)) || {}
    }
  },
  computed: {
    innerProps() {
      return merge(this.$options.defaultSetting, this.innerSettings)
    }
  },
  methods: {
    ...mapMutations('nodes', ['ASSIGN']),
    setSetting(value) {
      merge(this.innerSettings, value)
      this.ASSIGN({
        id: this.id,
        props: this.innerSettings
      })
    }
  }
}
