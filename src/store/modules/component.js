import localforage from 'localforage'
import jsonHistory from '../jsonHistory'
import { SET } from '../index'
import { getComponentSet } from '@/api/project'
import listToTree from '@/utils/listToTree'
import { traversal } from '@/utils/tool'

const state = {
  editingComponentSetId: null,
  componentsMap: {},
  childrenOf: {},
  tree: []
}

const mutations = {
  SET,
  RECORD(state, payLoad) {
    jsonHistory.current.record(payLoad)
  },
  SET_EDITING_COMPONENT_SET_ID(state, id) {
    state.editingComponentSetId = id
  },
  REDO() {
    jsonHistory.current.redo()
  },
  UNDO() {
    jsonHistory.current.undo()
  }
}

const actions = {
  setComponentSet({ commit, state, dispatch }, editingComponentSetId) {
    commit('SET', { editingComponentSetId })
    localforage.setItem('editingComponentSetId', editingComponentSetId)
    dispatch('initComponents')
  },

  removeComponentSet({ state: { editingComponentSetId }, commit }, id) {
    if (id === editingComponentSetId) {
      localforage.setItem('editingComponentSetId', null)
      commit('SET', {
        componentsMap: {},
        editingComponentSetId: null
      })
    }
  },

  async initComponents({ commit, rootState }) {
    const selectedIds = rootState.app.selectedComponentSetIds
    if (!selectedIds.length) return
    const map = {}
    const array = []

    const prmoises = selectedIds.map(async id => {
      const componentSet = await getComponentSet(id)

      traversal(componentSet, node => {
        map[node.id] = node

        if (id === node.id) {
          const { parentId, ...newNode } = node
          array.push(newNode)
        } else {
          array.push(node)
        }
      })
    })
    await Promise.all(prmoises)

    const { childrenOf, tree } = listToTree(array)

    commit('SET', {
      componentsMap: map,
      childrenOf,
      tree
    })

    jsonHistory.current.tree = map
  }
}

const getters = {
  parentPath: state => _id => {
    const map = state.componentsMap
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

const subscribe = {
  updateNodesMap(mutation, state) {
    if (
      [
        'component/INIT_NODES_MAP',
        'component/RECORD',
        'component/REDO',
        'component/ UNDO'
      ].includes(mutation.type)
    ) {

      localforage.setItem(
        state.component.editingComponentSetId.toString(),
        Object.values(state.component.componentsMap).map(node => {
          const { children, ...newNode } = node
          return newNode
        })
      )
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
  subscribe
}
