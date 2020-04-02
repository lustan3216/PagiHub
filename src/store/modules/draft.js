import Vue from 'vue'
import { cloneJson } from '../../utils/util'
import jsonStorer from 'json-storer'
import localforage from 'localforage'
import listToTree from '../../utils/listToTree'
import { draftIds } from '../../utils/keyId'
import { initTemplate } from '../../template/basic'
import { ROOT_ID } from '../../utils/keyId'

const state = {
  nodesMap: {}
}

const mutations = {
  RECORD(state, {}) {}
}

const actions = {
  async getRootNode({ dispatch, commit }, keyName = 'asd') {
    let nodesMap = await localforage.getItem(keyName)

    if (!Object.hasAnyKey(nodesMap)) {
      nodesMap = {
        node: initTemplate(),
        parentId: ROOT_ID
      }
      draftIds.appendIdNested(nodesMap)
    }

    commit('SET', nodesMap)
  }
}

const getters = {
  rootNode: state => state.nodesMap[ROOT_ID + 1],

  listToTree: ({ nodesMap }) => listToTree(Object.values(nodesMap)),

  tree: (state, getters) => getters.listToTree.tree,

  childrenFrom: (state, getters) => id => {
    // 父層在render子層時，這裡會把children拿掉，強制component不能抓到孫子
    // 如果想要處理孫子，應該是再做一個component做父子管理
    // 這樣可以解決效能上問題，以及統一父子關係，讓每個component的innerChildren的數據不會因為子孫資料過期
    return getters.listToTree.childrenOf[id].map(_node => {
      const { children, ...node } = _node
      return node
    })
  },

  parentPath: state => _id => {
    const map = state.nodesMap
    const path = []

    const findPath = id => {
      const { parentId } = map[id]

      if (parentId) {
        path.unshift(map[parentId])
        findPath(parentId)
      }
    }

    findPath(_id)
    return path
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
