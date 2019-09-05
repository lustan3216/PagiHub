import Vue from 'vue'
import JsTreeList from 'js-tree-list'

// let content
// try {
//   content = JSON.parse(localStorage.getItem('json'))
// } catch (e) {
//   content = []
// }

// const list = new JsTreeList.TreeToList(tree, {
//   key_child: "children",
//   empty_children: true
// }).GetList()

const store = Vue.observable({
  nodeForSetting: {},
  currentSidebar: null,
  originalNodesArray: [],
  currentNodesArray: [],
  nodesTree: []
})

export default store
