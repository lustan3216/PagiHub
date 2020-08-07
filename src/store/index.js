import Vue from 'vue'
import Vuex from 'vuex'
import component from './modules/component'
import example from './modules/example'
import app from './modules/app'
import mode from './modules/mode'
import user from './modules/user'
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

window.addEventListener('storage', function(event) {
  switch (event.key) {
    case 'copyComponentIds':
      return getCopyComponentIds()
    case 'tmpComponentsArray':
      return getTmpComponentsArray()
  }
})

export function getCopyComponentIds() {
  const ids = localStorage.getItem('copyComponentIds')
  store.commit('app/SET', { copyComponentIds: JSON.parse(ids) || [] }, { root: true })
}

export function getTmpComponentsArray() {
  const array = localStorage.getItem('tmpComponentsArray')
  store.commit('component/SET_NODES_TO_TMP_MAP', JSON.parse(array) || [], { root: true })
}

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    app,
    mode,
    component,
    user,
    example
  }
})

export default store
