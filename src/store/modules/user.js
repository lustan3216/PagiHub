import { SET } from '../index'
import { Auth } from 'aws-amplify'
import router from '@/router'

const state = {
  id: null,
  email: null,
  coverPhoto: null,
  username: null,
  description: null,
  facebookId: null,
  instagramId: null,
  user: null
}

const initData = JSON.parse(JSON.stringify(state))

const mutations = {
  SET,
  INIT(state) {
    for (const key in initData) {
      state[key] = initData[key]
    }
  }
}

const actions = {
  async getCurrentUser({ commit }) {
    try {
      window.Auth = Auth
      const user = await Auth.currentAuthenticatedUser()
      const { attributes } = user
      const id = JSON.parse(attributes.identities)[0].userId

      commit('SET', {
        id,
        user,
        email: attributes.email,
        coverPhoto: attributes['custom:coverPhoto'],
        username: attributes['custom:username'],
        description: attributes['custom:description'],
        facebookId: attributes['custom:facebookId'],
        instagramId: attributes['custom:instagramId']
      })
    }
    catch {
      router.push('/')
      commit('INIT')
    }
  },
  updateUser({ state, commit }, {}) {
    state.user.updateAttributes([{ Name: 'custom:description', Value: '1' }], () => {

    })
  },
  async logout({ commit }) {
    try {
      await Auth.signOut()
      commit('INIT')
    }
    catch (error) {
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
