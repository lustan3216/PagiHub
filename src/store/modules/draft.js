import jsonStorer from '../jsonStorer'
import localforage from 'localforage'
import listToTree from '../../utils/listToTree'
import { SET } from '../index'
import { draftIds } from '../../utils/keyId'
import { traversal } from '../../utils/tool'
import { initTemplate as _initTemplate } from '../../template/basic'
import { ROOT_ID } from '../../utils/keyId'

window.localforage = localforage

const state = {
  nodesMap: {},
  componentName: 'asd'
}

const mutations = {
  SET,
  RECORD(state, payLoad) {
    jsonStorer.record(payLoad)
    localforage.setItem('asd', jsonStorer.tree)
  },
  REDO() {
    jsonStorer.redo()
    localforage.setItem('asd', jsonStorer.tree)
  },
  UNDO() {
    jsonStorer.undo()
    localforage.setItem('asd', jsonStorer.tree)
  },
  UPDATE_NODES_MAP(state, payload) {
    state.nodesMap = payload
    localforage.setItem(state.componentName, payload)
  }
}

const actions = {
  async getRootNode({ commit, state }) {
    const nodesMap = (await localforage.getItem(state.componentName)) || {}

    if (Object.hasAnyKey(nodesMap)) {
      const ids = Object.keys(nodesMap).map(x => parseInt(x))
      draftIds.restoreIds = ids
    } else {
      const initTemplate = _initTemplate()
      initTemplate.parentId = 0
      draftIds.appendIdNested(initTemplate)

      traversal(initTemplate, _node => {
        // eslint-disable-next-line
        const { children: _, ...node } = _node
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
