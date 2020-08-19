import store, { SET } from '@/store'
import { CHILDREN, ID, PARENT_ID } from '@/const'
import {
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
const tmpChildrenOf = {}

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
    if (tree[key] && tree[key][ID]) {
      const parentId = componentsMap[key][PARENT_ID]
      const parentNode = componentsMap[parentId]
      if (parentNode) {
        deleteBy(parentNode[CHILDREN], 'id', key)
      }
    }

    Vue.delete(tree, key)
  },
  // only for component or component attrs
  VUE_SET({ componentsMap }, { tree, key, value }) {
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
  // only for project and componentSet
  DELETE_NODE(state, id) {
    // the number of projectIds and rootComponentSetIds are few, so lazy to check componentSet or project
    deleteBy(state.projectIds, 'id', id)
    deleteBy(state.rootComponentSetIds, 'id', id)
    Vue.delete(state.componentsMap, id)
  },

  CLEAN_EDITING_COMPONENT_SET_ID_BY_IDS(state, ids) {
    toArray(ids).forEach(id => {
      if (id === state.editingComponentSetId) {
        state.editingComponentSetId = null
      }
    })
  },
  SOFT_RECORD(state, payLoad) {
    const set = ({ path, value }) =>
      setValueByPath(state.componentsMap, path, value)
    Array.isArray(payLoad) ? payLoad.forEach(set) : set(payLoad)
  },
  RECORD(state, payLoad) {
    jsonHistory.debounceRecord(payLoad, 200, tree => {
      const string = JSON.stringify(tree, function(key, value) {
        if (value['children']) {
          const { children, ...newObject } = value
          return newObject
        }
        return value
      })

      return JSON.parse(string)
    })
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
