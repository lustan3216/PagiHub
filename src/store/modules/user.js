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
  async getCurrentLocalUser({ commit, dispatch }) {
    try {
      const user = await Auth.currentAuthenticatedUser()
      commit('SET', parseCognitoUser(user))

      // 為了UX體驗，一開始先用 local 的就好，增加速度，之後在底層用async 方式更新，如果失敗就登出
      dispatch('getCurrentRemoteUser')
    }
    catch {
      router.push('/login')
      commit('INIT')
    }
  },
  async getCurrentRemoteUser({ commit }) {
    const user = await Auth.currentAuthenticatedUser({ bypassCache: true })

    if (user.userDataKey) {
      commit('SET', parseCognitoUser(user))
    }
    else {
      router.push('/login')
      commit('INIT')
    }
  },
  async patchUser({ state, commit, dispatch }, { username }) {
    const { data } = await patchCurrentUser({ username })
    dispatch('getCurrentRemoteUser')
    commit('SET', { username: data.username })
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
  },
  isAdmin(state) {
    // TODO 之後有空要把這個值藏起來，或更名
    return state.user.signInUserSession.accessToken.payload['cognito:groups'].includes('admin')
  }
}

function parseCognitoUser(user) {
  const { attributes } = user
  const { userId } = JSON.parse(attributes.identities)[0]
  return {
    userId,
    user,
    email: attributes.email,
    coverPhoto: attributes['custom:coverPhoto'],
    username: attributes.preferred_username,
    description: attributes['custom:description'],
    facebookId: attributes['custom:facebookId'],
    instagramId: attributes['custom:instagramId']
  }
}

export default {
  namespaced: true,
  actions,
  state,
  mutations,
  getters
}
