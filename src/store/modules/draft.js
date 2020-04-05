import Vue from 'vue'
import JsonStorer from 'json-storer'
import localforage from 'localforage'
import listToTree from '../../utils/listToTree'
import { SET } from '../index'
import { draftIds } from '../../utils/keyId'
import { traversal, vueNestedMerge } from '../../utils/tool'
import { initTemplate as _initTemplate } from '../../template/basic'
import { ROOT_ID } from '../../utils/keyId'

const jsonStorer = new JsonStorer({
  deltas: localforage.getItem('undoDeltas'),
  callback: {
    onRecord: updateLocalForage,
    onRedo: updateLocalForage,
    onUndo: updateLocalForage
  },
  setter(tree, key, value) {
    // vueNestedMerge(tree, { [key]: value })
    if (tree[key] && tree.__ob__) {
      tree[key] = value
    } else {
      Vue.set(tree, key, value)
    }
    // Vue.set(store.state.draft.nodesMap, key, value)
    // tree[key] = value
  },
  deleter(tree, key) {
    Vue.delete(tree, key)
    // delete tree[key]
  }
})

function updateLocalForage() {
  const undoDeltas = jsonStorer.deltas.slice(jsonStorer.currentIndex)
  localforage.setItem('undoDeltas', undoDeltas)
  localforage.setItem('asd', jsonStorer.tree)
}

window.jsonStorer = jsonStorer

const state = {
  nodesMap: {},
  keyName: 'asd'
}

const mutations = {
  SET,
  RECORD(state, payLoad) {
    jsonStorer.record(payLoad)
  },
  REDO(state) {
    jsonStorer.redo()
  },
  UNDO(state) {
    jsonStorer.undo()
  },
  UPDATE_NODES_MAP(state, payload) {
    state.nodesMap = payload
    localforage.setItem(state.keyName, payload)
    // const ids = jsonStorer.currentDeltaGroup.map(x => parseInt(x.path))
  }
}

const actions = {
  async getRootNode({ commit, state }) {
    const nodesMap = (await localforage.getItem(state.keyName)) || {}

    if (Object.hasAnyKey(nodesMap)) {
      const ids = Object.keys(nodesMap).map(x => parseInt(x))
      draftIds.restoreIds = ids
    } else {
      const initTemplate = _initTemplate()
      initTemplate.parentId = 0
      draftIds.appendIdNested(initTemplate)
      traversal(initTemplate, _node => {
        const { children, ...node } = _node
        nodesMap[node.id] = node
      })
    }

    commit('UPDATE_NODES_MAP', nodesMap)
    jsonStorer.tree = state.nodesMap
  }
}

const getters = {
  rootNode: state => state.nodesMap[ROOT_ID + 1],

  listToTree: ({ nodesMap }) => listToTree(Object.values(nodesMap)),

  childrenOf: (state, getters) => getters.listToTree.childrenOf,

  tree: (state, getters) => getters.listToTree.tree,

  parentPath: state => _id => {
    const map = state.nodesMap
    const path = []

    function findPath(id) {
      const { parentId } = map[id]
      if (!parentId) return
      path.unshift(map[parentId])
      findPath(parentId)
    }

    findPath(_id)
    return path
  },

  theRootForm: (state, getters) => id => {
    return getters.parentPath(id).find(x => x.tag === 'form-generator')
  },

  isRootForm: (state, getters) => id => {
    return (
      !getters.theRootForm(id) && state.nodesMap[id].tag === 'form-generator'
    )
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
