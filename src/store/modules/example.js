import allExampleComponents from '../../template'
import { deepFlatten } from '../../utils/util'
import listToTree from '../../utils/listToTree'

const state = {
  examples: allExampleComponents()
}

const getters = {
  flattenExamples: state => deepFlatten(state.examples),

  listToTree(state, getters) {
    return listToTree(getters.flattenExamples)
  },

  rootNode(state, getters) {
    return getters.flattenExamples[1]
  },

  tree(state, getters) {
    return getters.listToTree.tree
  },

  childrenFrom: (state, getters) => id => {
    // 父層在render子層時，這裡會把children拿掉，強制component不能抓到孫子
    // 如果想要處理孫子，應該是再做一個component做父子管理
    // 這樣可以解決效能上問題，以及統一父子關係，讓每個component的innerChildren的數據不會因為子孫資料過期
    return getters.listToTree.childrenOf[id].map(_node => {
      const { children, ...node } = _node
      return node
    })
  }
}

export default {
  namespaced: true,
  state,
  getters
  // actions
}
