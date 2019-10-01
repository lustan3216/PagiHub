import Vue from 'vue'
import JsTreeList from 'js-tree-list'
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
  async getRootNodes({ dispatch, commit }) {
    const nodesMap = await dispatch('getRemoteMap')
    commit('SET', nodesMap)
    return mapToTree(nodesMap)
  },
  async initRootNodes({ rootState, commit }) {
    const { mode } = rootState.app
    const template = rootTemplate[mode]()

    const innerNodeTree = {
      tag: template.tag,
      children: template.children
    }

    appendNestedIds(innerNodeTree)

    commit('APPEND_NODE', {
      node: innerNodeTree,
      parentId: 0
    })
    return [innerNodeTree]
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
  nodesTree(state) {
    return mapToTree(state.currentNodesMap)
  }
}

function mapToTree(currentNodesMap) {
  const currentNodesArray = Object.values(currentNodesMap)
  const list = new JsTreeList.ListToTree(currentNodesArray, {
    key_parent: 'parentId',
    key_child: 'children'
  })

  list.sort((a, b) => {
    return a.content.sortIndex - b.content.sortIndex
  })

  return list.GetTree() || []
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
