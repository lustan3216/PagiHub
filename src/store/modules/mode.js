import { SET } from '../index'

const PRODUCTION = 0
const PREVIEW = 1
const EDITABLE = 2

const state = {
  mode: EDITABLE
}

const mutations = {
  SET,
  SET_PRODUCTION_MODE(state) {
    state.mode = PRODUCTION
  },
  SET_PREVIEW_MODE(state) {
    state.mode = PREVIEW
  },
  SET_EDITABLE_MODE(state) {
    state.mode = EDITABLE
  }
}

const getters = {
  isProductionMode(state) {
    return state.mode === PRODUCTION
  },
  isPreviewMode() {
    return state.mode === PREVIEW
  },
  isEditableMode() {
    return state.mode === EDITABLE
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
