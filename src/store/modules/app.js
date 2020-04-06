import { SET } from '../index'
import { arraySubtract } from '../../utils/tool'

const state = {
  scaleRatio: 1,
  selectedComponentIds: []
}

const mutations = {
  SET,
  CLEAN_SELECTED_COMPONENT_IDS(state, ids) {
    state.selectedComponentIds = arraySubtract(state.selectedComponentIds, ids)
  },
  TOGGLE_SELECTED_COMPONENT_IDS(state, id) {
    const isExist = state.selectedComponentIds.includes(id)
    if (isExist) {
      state.selectedComponentIds = arraySubtract(state.selectedComponentIds, id)
    } else {
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
      return rootState.draft.nodesMap[getters.selectedComponentId]
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
