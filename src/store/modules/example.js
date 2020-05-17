import allExampleComponents from '../../templateJson'
import { TAG, CHILDREN, ID } from '@/const'
import { traversal } from '@/utils/tool'

const state = {
  basic: allExampleComponents()
}

const mutations = {
  SET_EXAMPLES(state, basic) {
    state.basic = basic
  }
}

const getters = {
  basicMapByTag: state =>
    state.basic.reduce((all, example) => {
      const tag = example[TAG]
      all[tag] = example
      return all
    }, {}),

  basicMapById: state =>
    state.basic.reduce((all, example) => {
      const id = example[ID]
      all[id] = example
      return all
    }, {}),

  childrenOf(state) {
    const childrenOf = {}
    traversal(state.basic, node => {
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
