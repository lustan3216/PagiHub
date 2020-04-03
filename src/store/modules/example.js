import allExampleComponents from '../../template'
import { TAG, CHILDREN } from '../../const'
import { traversal } from '../../utils/tool'

const state = {
  examples: allExampleComponents()
}

const mutations = {
  SET_EXAMPLES(state, examples) {
    state.examples = examples
  }
}

const getters = {
  examplesMapByTag: state => state.examples.reduce((all, example) => {
    const tag = example[TAG]
    all[tag] = example
    return all
  }, {}),

  childrenOf(state) {
    const childrenOf = {}
    traversal(state.examples, (node) => {
      childrenOf[node] = node[CHILDREN] = []
    })
    return childrenOf
  },

  childrenFrom: (state, getters) => id => {
    // 父層在render子層時，這裡會把children拿掉，強制component不能抓到孫子
    // 如果想要處理孫子，應該是再做一個component做父子管理
    // 這樣可以解決效能上問題，以及統一父子關係，讓每個component的innerChildren的數據不會因為子孫資料過期
    return getters.childrenOf[id].map(_node => {
      const { children, ...node } = _node
      return node
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
