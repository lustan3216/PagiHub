import Vue from 'vue'
import Vuex from 'vuex'
import localforage from 'localforage'
import draft from './modules/node/draft'
import app from './modules/app'
import css from './modules/css'
import mode from './modules/mode'
import example from './modules/node/example'
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
    css,
    mode,
    draft,
    example,
    project
  }
})

store.subscribe((mutation, state) => {
  updateNodesMap(mutation, state)
  updateProjectMap(mutation, state)
})

export default store

function updateProjectMap(mutation, state) {
  if (
    ['project/SET', 'project/APPEND_NODE', 'project/DELETE_NODE'].includes(
      mutation.type
    )
  ) {
    localforage.setItem('project', state.project.projectMap)
  }
}

function updateNodesMap(mutation, state) {
  if (
    [
      'draft/INIT_NODES_MAP',
      'draft/RECORD',
      'draft/REDO',
      'draft/ UNDO'
    ].includes(mutation.type)
  ) {
    localforage.setItem(
      state.draft.draftComponentId.toString(),
      state.draft.nodesMap
    )
  }
}
