import { SET } from '../index'

const state = {
  selectedComponentIds: [],
  scaleRatio: 1
}

const mutations = {
  SET
}

export default {
  namespaced: true,
  state,
  mutations
}
