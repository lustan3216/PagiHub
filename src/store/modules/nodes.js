import Vue from 'vue'
import JsTreeList from 'js-tree-list'

const nodes = JSON.parse(window.localStorage.getItem('asd') || `{}`)

const state = {
  nodesTree: nodesTree(nodes),
  currentNodesMap: nodes
}

const mutations = {
  APPEND_NODE(state, _node) {
    const { children, ...node } = _node
    Vue.set(state.currentNodesMap, node.id, node)

    window.localStorage.setItem('asd', JSON.stringify(state.currentNodesMap))
  },
  REMOVE_NODE(state, id) {
    Vue.delete(state.currentNodesMap, id)
    window.localStorage.setItem('asd', JSON.stringify(state.currentNodesMap))
  },
  UPDATE_NODE_SORT(state, { id, sortIndex }) {
    Vue.set(state.currentNodesMap[id], sortIndex, sortIndex)

    window.localStorage.setItem('asd', JSON.stringify(state.currentNodesMap))
  }
}

const getters = {
  nodesTree(state) {
    return nodesTree(state.currentNodesMap)
  }
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
  return list.GetTree()
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
