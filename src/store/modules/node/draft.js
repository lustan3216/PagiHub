import localforage from 'localforage'
import jsonHistory from '../../jsonHistory'
import listToTree from '@/utils/listToTree'
import { SET } from '../../index'
import { componentIds } from '@/utils/keyId'
import { nestedToLinerObject, objectHasAnyKey } from '@/utils/tool'
import { layers } from '../../../templateJson/basic'

const state = {
  nodesMap: {},
  selectedComponentSetId: null
}

const mutations = {
  SET,
  INIT_NODES_MAP(state, payLoad) {
    state.nodesMap = payLoad
  },
  RECORD(state, payLoad) {
    jsonHistory.current.record(payLoad)
  },
  REDO() {
    jsonHistory.current.redo()
  },
  UNDO() {
    jsonHistory.current.undo()
  }
}

const actions = {
  setComponentSet({ commit, state, dispatch }, selectedComponentSetId) {
    commit('SET', { selectedComponentSetId })
    localforage.setItem('editingComponentSetId', selectedComponentSetId)
    dispatch('getRootNode')
  },

  removeComponentSet({ state: { selectedComponentSetId }, commit }, id) {
    if (id === selectedComponentSetId) {
      localforage.setItem('editingComponentSetId', null)
      commit('SET', {
        nodesMap: {},
        selectedComponentSetId: null
      })
    }
  },

  async getRootNode({ commit, state }) {
    const selectedId = state.selectedComponentSetId
    if (!selectedId) return

    const nodesMap = (await localforage.getItem(selectedId.toString())) || {}

    if (objectHasAnyKey(nodesMap)) {
      componentIds.restoreIds(nodesMap)
    } else {
      const initTemplate = layers()
      initTemplate.parentId = 0
      componentIds.appendIdNested(initTemplate)
      nestedToLinerObject(nodesMap, initTemplate)
    }

    commit('INIT_NODES_MAP', nodesMap)
    jsonHistory.current.tree = nodesMap
  }
}

const getters = {
  rootNode: (state, getters) =>
    getters.tree[0] && state.nodesMap[getters.tree[0].id],

  listToTree: ({ nodesMap }) => {
    return listToTree(Object.values(nodesMap))
  },

  childrenOf: (state, getters) => {
    return getters.listToTree.childrenOf
  },

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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
