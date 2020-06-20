import { SET } from '../index'

const state = {
  id: null
}

const mutations = {
  SET,
  INIT(state) {
    state.id = null
  }
}

const getters = {
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
