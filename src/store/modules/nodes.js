import Vue from 'vue'
import JsTreeList from 'js-tree-list'

const nodesFromStorage = JSON.parse(window.localStorage.getItem('asd') || `{}`)

const state = {
  nodesTree: nodesTree(nodesFromStorage)[0] || {},
  currentNodesMap: nodesFromStorage
}

const mutations = {
  APPEND_NESTED_NODES(state, { nodes, parentId }) {
    nodes.forEach(node => mutations.APPEND_NODE(state, { node, parentId }))
    save()
  },
  APPEND_NODE(state, { node, parentId }) {
    node.parentId = parentId
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
  REMOVE_NESTED_NODES(state, ids) {
    ids.forEach(id => mutations.REMOVE_NODE(state, id))
    save()
  },
  REMOVE_NODE(state, id) {
    const { children, ...node } = state.currentNodesMap[id]
    children && children.forEach(child => mutations.REMOVE_NODE(state, child.id))
    Vue.delete(state.currentNodesMap, node.id)
  },
  UPDATE_NODES_SORT(state, nodes) {
    nodes.forEach((node, index) => {
      Vue.set(state.currentNodesMap[node.id], 'sortIndex', index)
    })
    save()
  }
}

const getters = {
  nodesTree(state) {
    return nodesTree(state.currentNodesMap)
  }
}

function save() {
  window.localStorage.setItem('asd', JSON.stringify(state.currentNodesMap))
}

function nodesTree(currentNodesMap) {
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
  getters
}
