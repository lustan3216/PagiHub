import Vue from 'vue'
import Vuex from 'vuex'
import node from './modules/node/index'
import app from './modules/app'
import asset from './modules/asset'
import mode from './modules/mode'
import layout from './modules/layout'
import user from './modules/user'
import draftStateUploader from '../utils/draftStateUploader'

Vue.use(Vuex)

export function SET(state, data) {
  const keys = Object.keys(data)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    state[key] = data[key]
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
  store.commit(
    'app/SET',
    { copyComponentIds: JSON.parse(ids) || [] },
    { root: true }
  )
}

export function getTmpComponentsArray() {
  const array = localStorage.getItem('tmpComponentsArray')
  store.commit('node/SET_NODES_TO_TMP_MAP', JSON.parse(array) || [], {
    root: true
  })
}

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    app,
    mode,
    node,
    user,
    asset,
    layout
  }
})

store.watch(
  state => state.node.editingComponentSetId,
  (newValue, oldValue) => {
    draftStateUploader.requestImmediately(oldValue)
  }
)

store.watch(
  state => state.app.selectedComponentIds,
  newValue => {
    store.dispatch('layout/resizeNodeQuickFn', {}, { root: true })
  }
)

export default store
