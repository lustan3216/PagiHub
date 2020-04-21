import { SET } from '../index'
import { arraySubtract } from '@/utils/tool'

const state = {
  isAnimating: false,
  scaleRatio: 1,
  selectedComponentIds: [],
  copyComponentIds: [],
  hoverComponentId: null
}

const mutations = {
  SET,
  SET_COPY_SELECTED_COMPONENT_IDS(state) {
    state.copyComponentIds = state.selectedComponentIds
  },
  CLEAN_SELECTED_COMPONENT_IDS(state, ids) {
    state.selectedComponentIds = arraySubtract(state.selectedComponentIds, ids)
  },
  SET_HOVER_COMPONENT_ID(state, id) {
    state.hoverComponentId = id
  },
  SET_SELECTED_COMPONENT_ID(state, id) {
    state.selectedComponentIds = [id]
  },
  TOGGLE_SELECTED_COMPONENT_ID(state, id) {
    const isExist = state.selectedComponentIds.includes(id)
    state.selectedComponentIds = isExist ? [] : [id]
  },
  TOGGLE_SELECTED_COMPONENT_IN_IDS(state, id) {
    const isExist = state.selectedComponentIds.includes(id)
    if (isExist) {
      state.selectedComponentIds = arraySubtract(state.selectedComponentIds, id)
    } else {
      state.selectedComponentIds.push(id)
    }
  }
}

const getters = {
  theOnlySelectedComponentId(state) {
    if (state.selectedComponentIds.length === 1) {
      return +state.selectedComponentIds[0]
    }
  },
  selectedComponentNode(state, getters, rootState) {
    if (getters.theOnlySelectedComponentId) {
      return rootState.draft.nodesMap[getters.theOnlySelectedComponentId]
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
