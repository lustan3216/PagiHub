import localforage from 'localforage'
import jsonStorer from '../../jsonStorer'
import listToTree from '../../../utils/listToTree'
import { SET } from '../../index'
import { componentIds } from '../../../utils/keyId'
import { nestedToLinerObject } from '../../../utils/tool'
import { initTemplate as _initTemplate } from '../../../template/basic'

const state = {
  nodesMap: {},
  draftComponentId: null
}

const mutations = {
  SET,
  INIT_NODES_MAP(state, payLoad) {
    state.nodesMap = payLoad
  },
  RECORD(state, payLoad) {
    jsonStorer.current.record(payLoad)
  },
  REDO() {
    jsonStorer.current.redo()
  },
  UNDO() {
    jsonStorer.current.undo()
  }
}

const actions = {
  setComponent({ commit, state, dispatch }, draftComponentId) {
    commit('SET', { draftComponentId })
    dispatch('getRootNode')
  },

  async getRootNode({ commit, state }) {
    const nodesMap =
      (await localforage.getItem(state.draftComponentId.toString())) || {}

    if (Object.hasAnyKey(nodesMap)) {
      componentIds.restoreIds(nodesMap)
    } else {
      const initTemplate = _initTemplate()
      initTemplate.parentId = 0
      componentIds.appendIdNested(initTemplate)
      nestedToLinerObject(nodesMap, initTemplate)
    }

    commit('INIT_NODES_MAP', nodesMap)
    jsonStorer.current.tree = nodesMap
  }
}

const getters = {
  rootNode: (state, getters) =>
    getters.tree[0] && state.nodesMap[getters.tree[0].id],

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
