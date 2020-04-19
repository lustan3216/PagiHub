import allExampleComponents from '../../../example'
import { TAG, CHILDREN } from '@/const'
import { traversal } from '@/utils/tool'

const state = {
  examples: allExampleComponents()
}

const mutations = {
  SET_EXAMPLES(state, examples) {
    state.examples = examples
  }
}

const getters = {
  examplesMapByTag: state =>
    state.examples.reduce((all, example) => {
      const tag = example[TAG]
      all[tag] = example
      return all
    }, {}),

  childrenOf(state) {
    const childrenOf = {}
    traversal(state.examples, node => {
      childrenOf[node.id] = node[CHILDREN] || []
    })
    return childrenOf
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
