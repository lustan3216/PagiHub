const state = {
  nodeForSetting: {},
  currentSidebar: null
}

const mutations = {
  OPEN_SIDEBAR(state, sidebar) {
    state.currentSidebar = sidebar
  },
  CLOSE_SIDEBAR(state) {
    state.currentSidebar = null
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
