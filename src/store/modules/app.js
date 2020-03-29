import { SET } from '../index'

const state = {
  scaleRatio: 1,
  selectedComponentIds: []
}

const mutations = {
  SET,
  CLEAN_SELECTED_COMPONENT_IDS(state) {
    state.selectedComponentIds = []
  },
  SET_SELECTED_COMPONENT_IDS(state, id) {
    const isNoExist = state.selectedComponentIds.includes(id)
    if (!isNoExist) {
      state.selectedComponentIds.push(id)
    }
  }
}

const getters = {
  selectedComponentId(state) {
    if (state.selectedComponentIds.length) {
      return +state.selectedComponentIds[0]
    }
  },
  selectedComponentNode(state, getters, rootState) {
    if (getters.selectedComponentId) {
      return rootState.nodes.currentNodesMap[getters.selectedComponentId]
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
