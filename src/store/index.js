import Vue from 'vue'
import Vuex from 'vuex'
import draft from './modules/draft'
import app from './modules/app'
import css from './modules/css'
import mode from './modules/mode'
import example from './modules/example'
import project from './modules/project'

Vue.use(Vuex)

export function SET(state, data) {
  const keys = Object.keys(data)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (state[key] !== undefined) {
      state[key] = data[key]
    }
  }
}

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    app,
    css,
    mode,
    draft,
    example,
    project
  }
})

export default store
