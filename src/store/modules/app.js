import { SET } from '../index'
import { arraySubtract } from '@/utils/tool'

const state = {
  userId: null,
  isAnimating: false,
  scaleRatio: 1,
  selectedComponentIds: [],
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
    state.copyComponentIds = []
  },
  SET_SELECTED_COMPONENT_ID(state, id) {
    state.selectedComponentIds = [id].filter(x => x)
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
  setCopySelectedNodeId({ commit, state, rootState }) {
    const { rootComponentSetIds } = rootState.component
    const copyComponentIds = state.selectedComponentIds.filter(
      id => !rootComponentSetIds.includes(id)
    )
    // the top component under rootComponentSet should not be copied

    commit('SET', { copyComponentIds })
    return copyComponentIds
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
