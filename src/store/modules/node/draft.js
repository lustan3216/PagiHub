import localforage from 'localforage'
import jsonHistory from '../../jsonHistory'
import { SET } from '../../index'
import { componentIds } from '@/utils/keyId'
import { nestedToLinerObject, objectHasAnyKey } from '@/utils/tool'
import { layers } from '../../../templateJson/basic'
import { ID, PARENT_ID, CHILDREN } from '@/const'

const state = {
  nodesMap: {},
  childrenOf: {},
  tree: [],
  selectedComponentSetId: null
}

const mutations = {
  SET,
  INIT_NODES_MAP(state, payLoad) {
    state.nodesMap = payLoad
  },
  TO_TREE(state) {
    const data = Object.values(state.nodesMap)
    const tree = []
    const childrenOf = {}
    let item
    let id
    let parentId

    for (let i = 0, length = data.length; i < length; i++) {
      item = data[i]
      id = item[ID]
      parentId = item[PARENT_ID] || 0
      childrenOf[id] = childrenOf[id] || []
      item[CHILDREN] = childrenOf[id]

      if (parentId !== 0) {
        childrenOf[parentId] = childrenOf[parentId] || []
        childrenOf[parentId].push(item)
      } else {
        tree.push(item)
      }
    }

    state.childrenOf = childrenOf
    state.tree = tree
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
    commit('TO_TREE')

    jsonHistory.current.tree = nodesMap
  }
}

const getters = {
  rootNode: state => state.tree[0] && state.nodesMap[state.tree[0].id],

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
