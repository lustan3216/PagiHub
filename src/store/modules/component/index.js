import store, { SET } from '@/store'
import { CHILDREN, ID, PARENT_ID } from '@/const'
import {
  cloneJson,
  deleteBy,
  findBy,
  objectFirstKey,
  setValueByPath,
  toArray
} from '@/utils/tool'
import Vue from 'vue'
import { defineNodeProperties } from '@/utils/nodeProperties'
import {
  getRootComponentSetId,
  recordRootComponentSetId
} from '@/utils/rootComponentSetId'
import { isComponentSet, isProject } from '@/utils/node'
import jsonHistory from '@/store/jsonHistory'
import app from '@/main'

let childrenOf = {}
let tmpChildrenOf = {}

const state = {
  editingProjectId: null,
  editingComponentSetId: null,
  componentsMap: {},
  tmpComponentsMap: {},
  projectIds: [],
  rootComponentSetIds: []
}

const mutations = {
  SET,

  // only for component or component attrs
  VUE_DELETE({ componentsMap }, { tree, key }) {
    const node = tree[key]
    // 有id 代表component 沒有代表attr
    if (node && node[ID]) {
      if (isProject(node)) {
        deleteBy(state.projectIds, node.id)
      }
      else if (isComponentSet(node)) {
        deleteBy(state.rootComponentSetIds, node.id)
      }

      delete childrenOf[node[ID]]
      const parentId = componentsMap[key][PARENT_ID]
      const parentNode = componentsMap[parentId]

      if (parentNode && parentNode[CHILDREN]) {
        deleteBy(parentNode[CHILDREN], 'id', key)
      }
    }

    Vue.delete(tree, key)
  },
  // only for component or component attrs
  VUE_SET({ componentsMap }, { tree, key, value }) {
    value = cloneJson(value)
    // 這裡一定要 cloneJson, 不然deltas裡面的值會被改掉
    // VUE_DELETE delete childrenOf[node[ID]] 和 value = cloneJson(value) 一定要 不然會有reference loop bug
    if (tree[key] && tree[key].__ob__) {
      tree[key] = value
    }
    else {
      if (value[ID]) {
        childrenOf[key] = value[CHILDREN] =
          childrenOf[key] || value[CHILDREN] || []

        const parentId = value[PARENT_ID]
        childrenOf[parentId] = childrenOf[parentId] || []
        childrenOf[parentId].push(value)

        defineNodeProperties(value)
        Vue.set(componentsMap, key, value)
        recordRootComponentSetId(value[ID])
      }
      else {
        if (key === 'parentId') {
          const currentParentId = value
          childrenOf[currentParentId].push(componentsMap[tree.id])
          const originalParentId = tree[key]
          deleteBy(childrenOf[originalParentId], 'id', tree.id)
        }

        Vue.set(tree, key, value)
      }
    }
  },

  // only for component used to be paste
  SET_NODES_TO_TMP_MAP(state, componentsArray) {
    tmpChildrenOf = {}
    toArray(componentsArray).forEach(node => {
      const id = node[ID]
      const parentId = node[PARENT_ID]

      tmpChildrenOf[id] = tmpChildrenOf[id] || []
      node[CHILDREN] = tmpChildrenOf[id]

      if (parentId) {
        tmpChildrenOf[parentId] = tmpChildrenOf[parentId] || []
        const isExist = findBy(tmpChildrenOf[parentId], 'id', node.id)
        // this context only happens when hot reload
        if (!isExist) {
          tmpChildrenOf[parentId].push(node)
        }
      }

      Vue.set(state.tmpComponentsMap, id, node)
      defineNodeProperties(node)
    })
  },

  // only for project and componentSet
  SET_NODES_TO_MAP(state, componentsArray) {
    const { rootComponentSetIds, projectIds, componentsMap } = state

    toArray(componentsArray).forEach(node => {
      const id = node[ID]
      const parentId = node[PARENT_ID]

      if (
        isComponentSet(node) &&
        !rootComponentSetIds.find(id => id === node.id)
      ) {
        rootComponentSetIds.push(node.id)
      }
      else if (isProject(node) && !projectIds.find(id => id === node.id)) {
        projectIds.push(node.id)
      }

      node[CHILDREN] = childrenOf[id] = childrenOf[id] || []

      if (parentId) {
        childrenOf[parentId] = childrenOf[parentId] || []
        const isExist = findBy(childrenOf[parentId], 'id', node.id)
        // this context only happens when hot reload
        if (!isExist) {
          childrenOf[parentId].push(node)
        }
      }

      Vue.set(componentsMap, id, node)
      defineNodeProperties(node)
    })
  },

  CLEAN_EDITING_COMPONENT_SET_ID_BY_IDS(state, ids) {
    toArray(ids).forEach(id => {
      if (id === state.editingComponentSetId) {
        state.editingComponentSetId = null
      }
    })
  },
  SOFT_RECORD(state, payLoad) {
    // for hiding style temporary. not really update the json data
    const set = ({ path, value }) =>
      setValueByPath(state.componentsMap, path, value)
    Array.isArray(payLoad) ? payLoad.forEach(set) : set(payLoad)
  },
  RECORD(state, payLoad) {
    jsonHistory.debounceRecord(payLoad, 200)
  },
  REDO() {
    const done = rollbackSelectedComponentSet(jsonHistory.nextRedoDeltaGroup)
    if (done) {
      app.$nextTick(() => {
        jsonHistory.redo()
      })
    }
  },
  UNDO() {
    const done = rollbackSelectedComponentSet(jsonHistory.nextUndoDeltaGroup)
    if (done) {
      app.$nextTick(() => {
        jsonHistory.undo()
      })
    }
  },
  SET_EDITING_COMPONENT_SET_ID(state, id) {
    state.editingComponentSetId = id
  },
  INIT(state) {
    state.editingProjectId = null
    state.editingComponentSetId = null
    state.componentsMap = {}
    state.projectIds = []
    state.rootComponentSetIds = []

    childrenOf = {}
    jsonHistory.deltas = []
    jsonHistory.currentIndex = 0
  }
}

const getters = {}

function rollbackSelectedComponentSet(deltaGroup) {
  if (!deltaGroup) {
    return false
  }

  const id = objectFirstKey(deltaGroup[0])
  const { editingProjectId } = store.state.component
  const rootComponentSetId = getRootComponentSetId(id)
  if (rootComponentSetId !== editingProjectId) {
    store.commit('component/SET_EDITING_COMPONENT_SET_ID', rootComponentSetId, {
      root: true
    })
  }

  return true
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions: {
    ...require('./componentSet').actions,
    ...require('./project').actions
  }
}
