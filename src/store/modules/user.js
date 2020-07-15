import { SET } from '../index'
import { getCurrentUser } from '@/api/user'
import { Auth } from "aws-amplify";

const state = {
  id: null,
  email: null,
  verified: false,
  coverPhoto: null,
  username: null,
  description: null,
  facebookId: null,
  instagramId: null,
}

const initData = JSON.parse(JSON.stringify(state))

const mutations = {
  SET,
  INIT(state) {
    for (let key in initData) {
      state[key] = initData[key]
    }
  }
}

const actions = {
  async getCurrentUser({ commit }) {
    try {
      const { data } = await getCurrentUser()
      commit('SET', data)
      return data
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
