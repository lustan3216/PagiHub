import { SET } from '../index'
import { arraySubtract } from '@/utils/tool'

const state = {
  userId: null,
  isAnimating: false,
  scaleRatio: 1,
  selectedComponentIds: [],
  selectedComponentSetIds: [],
  copyComponentIds: [],
  dialog: null
}

const mutations = {
  SET,
  DIALOG_OPEN(state, name) {
    state.dialog = `dialog-${name}`
  },
  DIALOG_CLOSE(state) {
    state.dialog = null
  },
  RESET(state) {
    state.selectedComponentIds = []
    state.selectedComponentSetIds = []
    state.copyComponentIds = []
  },
  SET_COPY_SELECTED_COMPONENT_IDS(state) {
    state.copyComponentIds = state.selectedComponentIds
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

const actions = {
  toggleSelectedComponentSetInIds({ state, commit }, id) {
    const { selectedComponentSetIds } = state
    const isExist = selectedComponentSetIds.includes(id)
    if (isExist) {
      commit('SET', {
        selectedComponentSetIds: arraySubtract(selectedComponentSetIds, id)
      })
      commit('component/CLEAN_EDITING_COMPONENT_SET_ID_BY_IDS', id, { root: true })
    } else {
      commit('SET', {
        selectedComponentSetIds: [id, ...selectedComponentSetIds]
      })
      commit('component/SET_EDITING_COMPONENT_SET_ID', id, { root: true })
    }
  },
  toggleSelectedComponentSetId({ state, commit }, id) {
    const isExist = state.selectedComponentSetIds.includes(id)
    if (isExist) {
      commit('SET', { selectedComponentSetIds: [] })
      commit('component/CLEAN_EDITING_COMPONENT_SET_ID_BY_IDS', id, {
        root: true
      })
    } else {
      commit('SET', { selectedComponentSetIds: [id] })
      commit('component/SET_EDITING_COMPONENT_SET_ID', id, { root: true })
    }
  },
  cleanSelectedComponentSetIds({ commit }, ids) {
    const { selectedComponentSetIds } = state
    commit('SET', {
      selectedComponentSetIds: arraySubtract(selectedComponentSetIds, ids)
    })
    commit('component/CLEAN_EDITING_COMPONENT_SET_ID_BY_IDS', ids, {
      root: true
    })
  }
}

const getters = {
  theOnlySelectedComponentId(state) {
    if (state.selectedComponentIds.length === 1) {
      return state.selectedComponentIds[0]
    }
  },
  selectedComponentNode(state, getters, rootState) {
    if (getters.theOnlySelectedComponentId) {
      return rootState.component.componentsMap[
        getters.theOnlySelectedComponentId
      ]
    }
  },
  selectedComponentTree(state, getters, rootState) {
    if (getters.selectedComponentNode) {
      return {
        ...getters.selectedComponentNode,
        children:
          rootState.component.componentsMap[getters.theOnlySelectedComponentId]
            .children
      }
    }
  },
  selectedComponentNodes(state, getters, rootState) {
    return state.selectedComponentIds
      .map(id => rootState.component.componentsMap[id])
      .filter(node => node)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
