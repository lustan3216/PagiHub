import clone from 'clone'
import Vue from 'vue'
import listTiTree from '../../utils/listToTree'
import { SET } from '../index'
import { merge } from '../../lodash'
import { appendNestedIds } from '../../utils/keyId'
import { gridGenerator as templateGridGenerator } from '../../template/basic'

const state = {
  currentNodesMap: {}
}

const mutations = {
  SET,

  ASSIGN(state, payload) {
    const node = state.currentNodesMap[payload.id]
    merge(node, payload)
    mutations.SNAPSHOT(state)
  },

  APPEND_NESTED_NODES(state, { nodes, parentId }) {
    nodes.forEach(node => mutations.APPEND_NODE(state, { node, parentId }))
  },

  APPEND_NODE(state, { node, parentId }) {
    if (parentId === undefined) {
      throw new Error('noParentId')
    } else {
      node.parentId = parentId
    }
    const { children, ..._node } = node
    Vue.set(state.currentNodesMap, _node.id, _node)
    children &&
      children.forEach(child => {
        mutations.APPEND_NODE(state, {
          node: child,
          parentId: node.id
        })
      })
  },

  REMOVE_NESTED_NODES(state, nodes) {
    nodes.forEach(node => mutations.REMOVE_NODE(state, node))
  },

  REMOVE_NODE(state, _node) {
    const { children, ...node } = _node
    children && children.forEach(child => mutations.REMOVE_NODE(state, child))
    Vue.delete(state.currentNodesMap, node.id)
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
    const innerNodeTree = {
      tag: 'layers',
      children: [templateGridGenerator()]
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
    return getters.listToTree.childrenOf || {}
  },

  childrenFrom: (state, getters) => id => {
    // 父層在render子層時，這裡會把children拿掉，強制component不能抓到孫子
    // 如果想要處理孫子，應該是再做一個component做父子管理
    // 這樣可以解決效能上問題，以及統一父子關係，讓每個component的innerChildren的數據不會因為子孫資料過期
    return getters.childrenOf[id].map(_node => {
      const { children, ...node } = _node
      return node
    })
  },

  parentPath: state => _id => {
    const map = state.currentNodesMap
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
