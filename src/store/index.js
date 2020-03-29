import Vue from 'vue'
import Vuex from 'vuex'
import nodes from './modules/nodes'
import app from './modules/app'
import css from './modules/css'
import mode from './modules/mode'

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

export default new Vuex.Store({
  strict: true,
  modules: {
    nodes,
    app,
    css,
    mode
  }
})
