import allExampleComponents from '../../templateJson'
import { ID, CHILDREN } from '@/const'
import { traversal } from '@/utils/tool'

const state = {
  basic,
  basicComponentsMap,
  basicChildrenOf,
  componentSetsMap: {},
  componentSetsChildrenOf: {}
}

const mutations = {}

const getters = {
  exampleComponentsMap: state => {
    return { ...state.basicComponentsMap, ...state.componentSetsMap }
  },

  exampleChildrenOf(state) {
    return { ...state.basicChildrenOf, ...state.componentSetsChildrenOf }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
