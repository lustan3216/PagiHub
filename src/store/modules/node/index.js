import { SET } from '@/store'
import { CHILDREN, ID, PARENT_ID, SOFT_DELETE } from '@/const'
import { deleteBy, findBy, toArray } from '@/utils/array'
import Vue from 'vue'
import { defineProperties } from '@/utils/nodeProperties'
import { isComponentSet, isProject } from '@/utils/node'
import { cloneJson, setValueByPath } from '@/utils/tool'
import inheritMapUploader from '@/utils/inheritMapUploader'
import jsonHistory from '@/store/jsonHistory'

let childrenOf = {}
let tmpChildrenOf = {}

const state = {
  editingProjectId: null,
  editingComponentSetId: null,
  nodesMap: {},
  tmpComponentsMap: {},
  projectIds: [],
  rootComponentSetIds: []
}

const callbacks = {
  componentAddNew(node) {
    inheritMapUploader.add(node)
    this._vm.$bus.$emit('component-add-new', node)
  },
  componentDelete(node) {
    inheritMapUploader.remove(node)
    this._vm.$bus.$emit('component-delete', node)
  },
  componentUpdate(tree, key, value) {
    if (key === 'inheritance' && value) {
      inheritMapUploader.setComponentSet(tree)
    }
    else if (key === 'inheritance' && !value) {
      inheritMapUploader.unsetComponentSet(tree)
    }
  }
}

const mutations = {
  SET,

  // only for component or component attrs
  VUE_DELETE({ nodesMap }, { tree, key }) {
    const node = tree[key]
    // 有id 代表component 沒有代表attr
    if (node && node[ID]) {
      if (isProject(node)) {
        deleteBy(state.projectIds, node.id)
      }
      else if (isComponentSet(node)) {
        deleteBy(state.rootComponentSetIds, node.id)
      }

      const parentId = nodesMap[key][PARENT_ID]
      const parentNode = nodesMap[parentId]

      if (parentNode && parentNode[CHILDREN]) {
        deleteBy(parentNode[CHILDREN], 'id', key)
      }

      callbacks.componentDelete.call(this, node)
    }

    if (key === SOFT_DELETE) {
      // 這裡是把 SOFT_DELETE 拿掉，代表node復活的意思
      callbacks.componentAddNew.call(this, tree)
    }

    callbacks.componentUpdate.call(this, tree, key)
    Vue.delete(tree, key)
  },
  // only for component or component attrs
  VUE_SET({ nodesMap, editingComponentSetId }, { tree, key, value }) {
    if (value === null) {
      debugger
    }
    value = cloneJson(value)
    // 這裡一定要 cloneJson, 不然deltas裡面的值會被改掉
    // VUE_DELETE delete childrenOf[node[ID]] 和 value = cloneJson(value) 一定要 不然會有reference loop bug
    if (tree[key] && tree[key].__ob__) {
      tree[key] = value
    }
    else if (value[ID]) {
      childrenOf[key] = value[CHILDREN] =
        childrenOf[key] || value[CHILDREN] || []

      const parentId = value[PARENT_ID]
      childrenOf[parentId] = childrenOf[parentId] || []

      const isExist = findBy(childrenOf[parentId], 'id', value[ID])
      if (!isExist) {
        childrenOf[parentId].push(value)
      }

      defineProperties(value, editingComponentSetId)
      callbacks.componentAddNew.call(this, value)
      Vue.set(nodesMap, key, value)
    }
    else if (key === 'parentId') {
      const currentParentId = value
      childrenOf[currentParentId].push(nodesMap[tree.id])
      const originalParentId = tree[key]
      deleteBy(childrenOf[originalParentId], 'id', tree.id)
      Vue.set(tree, key, value)
    }
    else {
      Vue.set(tree, key, value)
    }

    if (key === SOFT_DELETE && value) {
      callbacks.componentDelete.call(this, tree)
    }

    callbacks.componentUpdate.call(this, tree, key, value)
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
      defineProperties(node)
    })
  },

  // only for project and componentSet
  SET_NODES_TO_MAP(state, { nodes, rootComponentSetId }) {
    const { rootComponentSetIds, projectIds, nodesMap } = state

    toArray(nodes).forEach(node => {
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

      Vue.set(nodesMap, id, node)
      defineProperties(node, rootComponentSetId)
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
    // update tree directly without jsonHistory
    const set = ({ path, value }) => setValueByPath(state.nodesMap, path, value)
    Array.isArray(payLoad) ? payLoad.forEach(set) : set(payLoad)
  },
  RECORD(state, payLoad) {
    jsonHistory.debounceRecord(payLoad, 300)
  },
  IRREVERSIBLE_RECORD(state, payLoad) {
    jsonHistory.irreversibleRecord(payLoad)
  },
  REDO() {
    jsonHistory.redo()
  },
  UNDO() {
    jsonHistory.undo()
  },
  SET_EDITING_COMPONENT_SET_ID(state, id) {
    state.editingComponentSetId = id
  },
  INIT(state) {
    state.editingProjectId = null
    state.editingComponentSetId = null
    state.nodesMap = {}
    state.projectIds = []
    state.rootComponentSetIds = []

    childrenOf = {}
    jsonHistory.deltas = []
    jsonHistory.currentIndex = 0
  }
}

const getters = {
  projectNodes(state) {
    return state.projectIds.map(id => state.nodesMap[id]).filter(node => node)
  }
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
