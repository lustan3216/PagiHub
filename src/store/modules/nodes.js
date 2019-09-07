import Vue from 'vue'
import JsTreeList from 'js-tree-list'

const state = {
  nodesTree: nodesTree(),
  currentNodesMap: JSON.parse(window.localStorage.getItem('asd') || `{}`)
}

const mutations = {
  UPDATE_NODE(state, _node) {
    const { children, ...node } = _node
    state.currentNodesMap[node.id] = node
  },
  APPEND_NODE(state, _node) {
    const { children, ...node } = _node
    state.currentNodesMap[node.id] = node

    window.localStorage.setItem('asd', JSON.stringify(state.currentNodesMap))
  },
  REMOVE_NODE(state, id) {
    Vue.delete(state.currentNodesMap, id)
    window.localStorage.setItem('asd', JSON.stringify(state.currentNodesMap))
  },
  UPDATE_NODE_SORT(state, { id, sortIndex }) {
    state.currentNodesMap[id].sortIndex = sortIndex
  }
}

function nodesTree() {
  const currentNodesMap = JSON.parse(window.localStorage.getItem('asd') || `{}`)
  const currentNodesArray = Object.values(currentNodesMap)
  const list = new JsTreeList.ListToTree(currentNodesArray, {
    key_parent: 'parentId',
    key_child: 'children',
    sort: 'sortIndex'
  })

  return list.GetTree()
}
window.asd = nodesTree
export default {
  namespaced: true,
  state,
  mutations
}
