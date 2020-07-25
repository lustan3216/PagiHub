import { SET } from '../index'
import { getCurrentUser } from '@/api/user'
import { Auth } from 'aws-amplify'

const state = {
  id: 'Facebook_3189364354449003',
  email: 'et3216@gmail.com',
  verified: false,
  coverPhoto:
    'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3189364354449003&height=200&width=200&ext=1598172526&hash=AeT17JIS-6xPAW3k',
  username: 'username',
  description: 'dewdew',
  facebookId: null,
  instagramId: null
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
