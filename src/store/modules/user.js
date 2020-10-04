import { SET } from '../index'
import { Auth } from 'aws-amplify'
import router from '@/router'
import { patchCurrentUser } from '@/api/user'

const state = {
  userId: null,
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
      const user = await Auth.currentAuthenticatedUser()
      const { attributes } = user
      const { userId } = JSON.parse(attributes.identities)[0]

      commit('SET', {
        userId,
        user,
        email: attributes.email,
        coverPhoto: attributes['custom:coverPhoto'],
        username: attributes.preferred_username,
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
  async patchUser({ state, commit }, { username }) {
    const { data } = await patchCurrentUser({ username })
    commit('SET', {
      username: data.username
    })
  },
  async logout({ commit }) {
    try {
      commit('INIT')
      await Auth.signOut()
    }
    catch (error) {
      console.log('error signing out: ', error)
    }
  }
}

const getters = {
  isLogin(state) {
    return state.userId
  }
}

export default {
  namespaced: true,
  actions,
  state,
  mutations,
  getters
}
