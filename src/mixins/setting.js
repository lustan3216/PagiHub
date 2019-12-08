import clone from 'clone'
import store from '../store'
import { mapMutations } from 'vuex'
import { merge } from '../lodash'
import { assignSet } from '../utils/util'

export default {
  data() {
    const node = store.state.nodes.currentNodesMap[this.id]
    const setting = clone(this.$options.defaultSetting)
    const propsFromNode = (node && clone(node.props)) || {}
    return {
      innerProps: merge(setting, propsFromNode)
    }
  },
  methods: {
    ...mapMutations('nodes', ['ASSIGN']),
    setSetting(value) {

      assignSet(this.innerProps, value)
      this.ASSIGN({
        id: this.id,
        props: this.innerProps
      })
    }
  }
}
