import localforage from 'localforage'
import jsonStorer from '../jsonStorer'
import listToTree from '../../utils/listToTree'
import { SET } from '../index'
import { componentIds } from '../../utils/keyId'
import { traversal } from '../../utils/tool'
import { initTemplate as _initTemplate } from '../../template/basic'

const state = {
  nodesMap: {},
  componentId: 0
}

const mutations = {
  SET,
  INIT_NODES_MAP(state, payLoad) {
    state.nodesMap = payLoad
    localforage.setItem(state.componentId, state.nodesMap)
  },
  RECORD(state, payLoad) {
    jsonStorer(state.componentId).record(payLoad)
    localforage.setItem(state.componentId, state.nodesMap)
  },
  REDO() {
    jsonStorer(state.componentId).redo()
    localforage.setItem(state.componentId, state.nodesMap)
  },
  UNDO() {
    jsonStorer(state.componentId).undo()
    localforage.setItem(state.componentId, state.nodesMap)
  }
}

const actions = {
  setComponent({ commit, state, dispatch }, componentId) {
    commit('SET', { componentId })
    dispatch('getRootNode')
  },

  async getRootNode({ commit, state }) {
    const nodesMap = (await localforage.getItem(state.componentId)) || {}

    if (Object.hasAnyKey(nodesMap)) {
      const ids = Object.keys(nodesMap).map(x => parseInt(x))
      componentIds.restoreIds = ids
    } else {
      const initTemplate = _initTemplate()
      initTemplate.parentId = 0
      componentIds.appendIdNested(initTemplate)

      traversal(initTemplate, _node => {
        // eslint-disable-next-line
        const { children: _, ...node } = _node
        nodesMap[node.id] = node
      })
    }

    commit('INIT_NODES_MAP', nodesMap)
    jsonStorer(state.componentId).tree = nodesMap
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
