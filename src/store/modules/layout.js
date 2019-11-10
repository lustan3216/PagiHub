import { SET } from '../index'

const state = {
  currentSidebar: {
    type: null,
    componentId: null
  },
  currentDialog: {
    type: null,
    componentId: null
  }
}

const mutations = {
  SET,
  OPEN_SIDEBAR(state, payload) {
    if (typeof payload === 'string') {
      state.currentSidebar = { type: payload, componentId: null }
    } else {
      const { type, componentId } = payload
      state.currentSidebar = { type, componentId }
    }
  },
  CLOSE_SIDEBAR(state) {
    state.currentSidebar = { type: null, componentId: null }
  },
  OPEN_DIALOG(state, payload) {
    if (typeof payload === 'string') {
      state.currentDialog = { type: payload, componentId: null }
    } else {
      const { type, componentId } = payload
      state.currentDialog = { type, componentId }
    }
  },
  CLOSE_DIALOG(state) {
    state.currentDialog = { type: null, componentId: null }
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
