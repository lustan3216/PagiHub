import Vue from 'vue'
import Vuex from 'vuex'
import component from './modules/component'
import app from './modules/app'
import mode from './modules/mode'
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

export function VUE_SET(state, { tree, key, value }) {
  if (isUndefined(value)) {
    Vue.delete(tree, key)
  } else if (tree[key] && tree.__ob__) {
    tree[key] = value
  } else {
    Vue.set(tree, key, value)
  }
}

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    app,
    mode,
    component,
    project
  }
})

store.subscribe((mutation, state) => {

}, { prepend: true })

store.subscribe((mutation, state) => {
  component.subscribe.updateNodesMap(mutation, state)
  component.subscribe.editingComponentSetId(mutation, state)
  project.subscribe.updateProjectMap(mutation, state)
})

export default store
