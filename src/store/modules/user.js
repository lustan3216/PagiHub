import { SET } from '../index'
import { getCurrentUser } from '@/api/user'
import { Auth } from "aws-amplify";

const state = {
  id: null,
  email: null,
  username: null,
  verified: false,
  coverPhoto: null,
}

const mutations = {
  SET,
  INIT(state) {
    state.id = null
    state.email = null
    state.username = null
    state.coverPhoto = null
    state.verified = false
  }
}

const actions = {
  async getCurrentUser({ commit }) {
    try {
      const { data } = await getCurrentUser()
      const { id, email, username, coverPhoto, verified } = data
      commit('SET', {
        id,
        email,
        username,
        coverPhoto,
        verified
      })
    } catch {
      commit('INIT')
    }
  },
  async logout({ commit }) {
    try {
      await Auth.signOut()
      commit('INIT')
    } catch (error) {
      console.log('error signing out: ', error)
    }
  }
}

const getters = {
  isLogin(state) {
    return state.id
  }
}

export default {
  namespaced: true,
  actions,
  state,
  mutations,
  getters
}
