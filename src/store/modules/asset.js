import { SET } from '../index'
import { getAssets, deleteAsset } from '@/api/asset'

const state = {
  images: [],
  isImageDialogOpen: false
}

const mutations = {
  SET,
  ADD_IMAGE(state, image) {
    state.images.push(image)
  },
  OPEN_ASSET(state) {
    state.isImageDialogOpen = true
  },
  CLOSE_ASSET() {
    state.isImageDialogOpen = false
  }
}

const actions = {
  async getAssets({ rootState, commit }, projectId) {
    const data = await getAssets({ projectId })
    commit('SET', { images: data.data })
  },
  // postAsset is a special case, hard to do here. the code in PanelAsset
  async deleteAsset({ state, commit }, id) {
    await deleteAsset({ id })
    commit('SET', { images: state.images.filter(image => image.id !== id) })
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
