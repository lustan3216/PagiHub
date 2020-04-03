import JsonStorer from 'json-storer'
import localforage from 'localforage'
import listToTree from '../../utils/listToTree'
import { draftIds } from '../../utils/keyId'
import { initTemplate } from '../../template/basic'
import { ROOT_ID } from '../../utils/keyId'

const jsonStorer = new JsonStorer({
  deltas: localforage.getItem('undoDeltas'),
  onRecord() {
    const undoDeltas = jsonStorer.deltas.slice(jsonStorer.currentIndex)
    localforage.setItem('undoDeltas', undoDeltas)
  }
})

const state = {
  nodesMap: {}
}

const mutations = {
  RECORD(state, payLoad) {
    this.nodesMap = jsonStorer.record(payLoad)
  },
  REDO() {
    // should have problem here
    this.nodesMap = jsonStorer.redo()
    // const ids = jsonStorer.currentDeltaGroup.map(x => parseInt(x.path))
  },
  UNDO() {
    // should have problem here
    this.nodesMap = jsonStorer.undo()
  }
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

    jsonStorer.tree = nodesMap
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

    function findPath(id) {
      const { parentId } = map[id]
      if (!parentId) return
      path.unshift(map[parentId])
      findPath(parentId)
    }

    findPath(_id)
    return path
  },

  theRootForm: (state, getters) => id => {
    return getters.parentPath(id).find(x => x.tag === 'form-generator')
  },

  isRootForm: (state, getters) => id => !getters.theRootForm(id)
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
