import { SET } from '../index'

const state = {
  selectedComponentIds: [],
  scaleRatio: 100
}

const mutations = {
  SET
}

export default {
  namespaced: true,
  state,
  mutations
}
