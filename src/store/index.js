import Vue from 'vue'
import Vuex from 'vuex'
import component from './modules/component'
import app from './modules/app'
import mode from './modules/mode'
import example from './modules/example'
import project from './modules/project'
import { isUndefined } from '../utils/tool'

Vue.use(Vuex)

export function SET(state, data) {
  const keys = Object.keys(data)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (!isUndefined(state[key])) {
      state[key] = data[key]
    }
  }
}

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    app,
    mode,
    component,
    example,
    project
  }
})

store.subscribe((mutation, state) => {
  app.subscribe.onSelectedComponentSetIds(mutation, state)
  component.subscribe.updateNodesMap(mutation, state)
  project.subscribe.updateProjectMap(mutation, state)
})

export default store
