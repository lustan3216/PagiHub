import store, { SET } from '../index'
import { arraySubtract } from '@/utils/tool'

const state = {
  isAnimating: false,
  scaleRatio: 1,
  selectedComponentIds: [],
  selectedComponentSetIds: [],
  copyComponentIds: []
}

const mutations = {
  SET,
  SET_COPY_SELECTED_COMPONENT_IDS(state) {
    state.copyComponentIds = state.selectedComponentIds
  },
  TOGGLE_SELECTED_COMPONENT_SET_IN_IDS(state, id) {
    const isExist = state.selectedComponentSetIds.includes(id)
    if (isExist) {
      state.selectedComponentSetIds = arraySubtract(state.selectedComponentSetIds, id)
    } else {
      state.selectedComponentSetIds.push(id)
    }
  },
  TOGGLE_SELECTED_COMPONENT_SET_ID(state, id) {
    const isExist = state.selectedComponentSetIds.includes(id)
    state.selectedComponentSetIds = isExist ? [] : [id]
  },
  CLEAN_SELECTED_COMPONENT_IDS(state, ids) {
    state.selectedComponentIds = arraySubtract(state.selectedComponentIds, ids)
  },
  SET_SELECTED_COMPONENT_ID(state, id) {
    state.selectedComponentIds = [+id]
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
      return rootState.component.componentsMap[getters.theOnlySelectedComponentId]
    }
  },
  selectedComponentTree(state, getters, rootState) {
    if (getters.selectedComponentNode) {
      return {
        ...getters.selectedComponentNode,
        children: rootState.component.childrenOf[getters.theOnlySelectedComponentId]
      }
    }
  },
  selectedComponentNodes(state, getters, rootState) {
    return state.selectedComponentIds.map(id => rootState.component.componentsMap[id])
  }
}

const subscribe = {
  onSelectedComponentSetIds(mutation, state) {
    if (
      [
        'app/TOGGLE_SELECTED_COMPONENT_SET_IN_IDS',
        'app/TOGGLE_SELECTED_COMPONENT_SET_ID'
      ].includes(mutation.type)
    ) {
      store.dispatch('component/initComponents')
    }
  }
}

export default {
  namespaced: true,
  state,
  subscribe,
  mutations,
  getters
}
