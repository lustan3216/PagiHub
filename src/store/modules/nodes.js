import clone from 'clone'
import Vue from 'vue'
import listTiTree from '../../utils/listToTree'
import { SET } from '../index'
import { appendNestedIds } from '../../utils/keyId'
import { carousel as templateCarousel } from '../../templates'
import { gridGenerator as templateGridGenerator } from '../../templates'

const rootTemplate = {
  website: templateGridGenerator,
  carousel: templateCarousel,
  component: templateGridGenerator
}

const state = {
  currentNodesMap: []
}

const mutations = {
  SET,
  APPEND_NESTED_NODES(state, { nodes, parentId }) {
    nodes.forEach(node => mutations.APPEND_NODE(state, { node, parentId }))
  },
  APPEND_NODE(state, { node, parentId }) {
    if (parentId === undefined) {
      throw 'noParentId'
    } else {
      node.parentId = parentId
    }
    const { children, ..._node } = node
    Vue.set(state.currentNodesMap, _node.id, _node)
    children &&
      children.forEach(child =>
        mutations.APPEND_NODE(state, {
          node: child,
          parentId: node.id
        })
      )
  },
  REMOVE_NESTED_NODES(state, nodes) {
    nodes.forEach(node => mutations.REMOVE_NODE(state, node))
    mutations.SNAPSHOT(state)
  },
  REMOVE_NODE(state, _node) {
    const { children, ...node } = _node
    children && children.forEach(child => mutations.REMOVE_NODE(state, child))
    Vue.delete(state.currentNodesMap, node.id)
  },
  UPDATE_NODES_SORT(state, nodes) {
    nodes.forEach((node, index) => {
      Vue.set(state.currentNodesMap[node.id], 'sortIndex', index)
    })
  },
  SNAPSHOT(state) {
    window.localStorage.setItem('asd', JSON.stringify(state.currentNodesMap))
  }
}

const actions = {
  async getRootNode({ dispatch, commit }) {
    const nodesMap = await dispatch('getRemoteMap')
    commit('SET', nodesMap)
    if (!Object.keys(nodesMap).length) {
      dispatch('initRootNode')
    }
  },
  async initRootNode({ rootState, commit }) {
    const { mode } = rootState.app
    const template = rootTemplate[mode]()

    const innerNodeTree = {
      tag: 'layers',
      children: [template]
    }

    appendNestedIds(innerNodeTree)

    commit('APPEND_NODE', {
      node: innerNodeTree,
      parentId: 0
    })
  },
  getRemoteMap({ commit }) {
    const nodesMap = JSON.parse(window.localStorage.getItem('asd') || `{}`)
    commit('SET', {
      currentNodesMap: nodesMap
    })
    return nodesMap
  }
}

const getters = {
  listToTree(state) {
    return mapToTree(state.currentNodesMap)
  },
  rootNode(state) {
    return state.currentNodesMap[1]
  },
  tree(state, getters) {
    return getters.listToTree.tree
  },
  childrenOf(state, getters) {
    return getters.listToTree.childrenOf || []
  },
  childrenFrom: (state, getters) => id => {
    return getters.childrenOf[id].map(_node => {
      const { children, ...node } = _node
      return node
    })
  }
}

function mapToTree(currentNodesMap) {
  const currentNodesArray = Object.values(clone(currentNodesMap))
  return listTiTree(currentNodesArray)
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
