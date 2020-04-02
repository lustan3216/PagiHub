import { SET } from '../index'

const PRODUCTION = 0
const PREVIEW = 1
const DRAFT = 2

const state = {
  mode: DRAFT
}

const mutations = {
  SET,
  SET_PRODUCTION_MODE(state) {
    state.mode = PRODUCTION
  },
  SET_PREVIEW_MODE(state) {
    state.mode = PREVIEW
  },
  SET_DRAFT_MODE(state) {
    state.mode = DRAFT
  }
}

const getters = {
  isProductionMode(state) {
    return state.mode === PRODUCTION
  },
  isPreviewMode() {
    return state.mode === PREVIEW
  },
  isDraftMode() {
    return state.mode === DRAFT
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
