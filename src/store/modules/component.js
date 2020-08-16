import Vue from 'vue'
import app from '@/main'
import jsonHistory from '../jsonHistory'
import store, {
  SET,
  getCopyComponentIds,
  getTmpComponentsArray
} from '../index'
import {
  createComponentSet,
  createProject,
  deleteProject,
  getComponentSetChildren,
  getComponentSets,
  getProjects,
  patchProject,
  getProject,
  deleteComponentSet,
  patchComponentSet
} from '@/api/node'
import {
  findBy,
  deleteBy,
  toArray,
  objectFirstKey,
  cloneJson,
  setValueByPath
} from '@/utils/tool'
import { CHILDREN, ID, PARENT_ID, LABEL } from '@/const'
import { isProject, isComponentSet } from '@/utils/node'
import { defineNodeProperties } from '@/utils/nodeProperties'
import {
  getRootComponentSetId,
  recordRootComponentSetId,
  recordRootComponentSetIdByArray
} from '@/utils/rootComponentSetId'
import { vmAddNodesToParentAndRecord } from '@/utils/vmMap'
import { layers } from '@/templateJson/basic'

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
    value = cloneJson(value)
    if (tree[key] && tree[key].__ob__) {
      tree[key] = value
    } else {
      if (value[ID]) {
        childrenOf[key] = value[CHILDREN] =
          childrenOf[key] || value[CHILDREN] || []

        const parentId = value[PARENT_ID]
        childrenOf[parentId] = childrenOf[parentId] || []
        childrenOf[parentId].push(value)

        defineNodeProperties(value)
        Vue.set(componentsMap, key, value)
        recordRootComponentSetId(value[ID])
      } else {
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
      } else if (isProject(node) && !projectIds.find(id => id === node.id)) {
        projectIds.push(node.id)
      }

      childrenOf[id] = childrenOf[id] || []
      node[CHILDREN] = childrenOf[id]

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
    jsonHistory.record(payLoad)
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
  }
}

const actions = {
  async getProjects({ commit }) {
    const { data } = await getProjects()

    commit('SET_NODES_TO_MAP', data)
    commit('SET', { projectIds: data.map(x => x[ID]) })
  },

  async getProject({ commit, dispatch }, id) {
    let node = state.componentsMap[id]

    if (!node) {
      const { data } = await getProject(id)
      commit('SET_NODES_TO_MAP', data)
      node = data
    }

    commit('SET', {
      rootComponentSetIds: [],
      editingProjectId: id
    })
    dispatch('getComponentSets', id)
    return node
  },

  async createProject({ commit }, form) {
    const { data } = await createProject(form)

    commit('SET_NODES_TO_MAP', data)
    return data
  },

  async patchProject({ commit }, { id, ...form }) {
    const { data } = await patchProject(id, form)
    commit('SET_NODES_TO_MAP', data)
  },

  async getComponentSetChildren({ commit, state }, id) {
    const componentsArray = await getComponentSetChildren(id)
    if (componentsArray.length) {
      commit('SET_NODES_TO_MAP', componentsArray)
      recordRootComponentSetIdByArray(id, componentsArray)
      getCopyComponentIds()
      getTmpComponentsArray()
    } else {
      vmAddNodesToParentAndRecord(
        id,
        layers({
          [LABEL]: state.componentsMap[id][LABEL]
        })
      )
    }
  },

  async getComponentSets({ commit, state }, projectId) {
    const { data: nodes } = await getComponentSets(projectId)
    commit('SET_NODES_TO_MAP', nodes)
    if (nodes[0] && nodes[0].id) {
      commit('SET_EDITING_COMPONENT_SET_ID', nodes[0].id)
    }
  },

  async createComponentSet({ commit, state, dispatch }, { projectId, attrs }) {
    const { data } = await createComponentSet(projectId, attrs)
    commit('SET_EDITING_COMPONENT_SET_ID', data.id)
    commit('SET_NODES_TO_MAP', data)
  },

  async patchComponentSet({ commit, state, dispatch }, { id, attrs }) {
    const { data } = await patchComponentSet(id, attrs)
    commit('SET_NODES_TO_MAP', data)
  },

  modifyProjectNodeParent({ commit, state }, { parentId, id }) {
    commit('APPEND_NODE', {
      id,
      node: {
        ...state.componentsMap[id],
        parentId
      }
    })
  },

  async deleteProjectNode({ state, commit, getters, dispatch }, id) {
    await deleteProject(id)

    commit('SET', {
      editingProjectId: null,
      editingComponentSetId: null,
      componentsMap: {},
      projectIds: [],
      rootComponentSetIds: []
    })

    childrenOf = {}
    jsonHistory.deltas = []
    jsonHistory.currentIndex = 0
  },

  async deleteComponentSet({ state, commit, getters, dispatch }, id) {
    await deleteComponentSet(id)
    const ids = [id]
    const gatherGrandChildrenIds = nodeId => {
      childrenOf[nodeId].forEach(child => {
        ids.push(child.id)

        gatherGrandChildrenIds(child.id)
      })
    }

    gatherGrandChildrenIds(id)

    commit('CLEAN_EDITING_COMPONENT_SET_ID_BY_IDS', ids)

    ids.forEach(id => {
      if (isComponentSet(state.componentsMap[id])) {
        commit('CLEAN_EDITING_COMPONENT_SET_ID_BY_IDS', id)
      }
      commit('DELETE_NODE', id)
    })

    jsonHistory.cleanDeltas(delta => {
      const key = objectFirstKey(delta)
      return ids.includes(key)
    })
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
  actions
}
