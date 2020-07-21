import Vue from 'vue'
import app from '@/main'
import jsonHistory from '../jsonHistory'
import store, { SET } from '../index'
import {
  createComponentSet,
  createProject,
  deleteProject,
  getComponentSet,
  getComponentSets,
  getProjects,
  patchProject,
  getProject,
  deleteComponentSet,
  patchComponentSet
} from '@/api/node'
import {
  objectHasAnyKey,
  findBy,
  forEach,
  deleteBy,
  toArray,
  objectFirstKey
} from '@/utils/tool'
import { Message } from 'element-ui'
import { CHILDREN, ID, PARENT_ID } from '@/const'
import { defineNodeProperties, isComponentSet, isProject } from '@/utils/node'

let childrenOf = {}

const state = {
  editingProjectId: null,
  editingComponentSetId: null,
  componentsMap: {},
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
    } else {
      if (value[ID]) {
        childrenOf[key] = value[CHILDREN] =
          childrenOf[key] || value[CHILDREN] || []

        const parentId = value[PARENT_ID]
        childrenOf[parentId] = childrenOf[parentId] || []
        childrenOf[parentId].push(value)

        defineNodeProperties(value)
        Vue.set(componentsMap, key, value)
      } else {
        Vue.set(tree, key, value)
      }
    }
  },

  // only for project and componentSet
  SET_NODES_TO_MAP(state, componentsArray) {
    const { rootComponentSetIds, projectIds, componentsMap } = state

    forEach(componentsArray, node => {
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

  SET_EDITING_COMPONENT_SET_ID(state, id) {
    state.editingComponentSetId = id
    // store.commit('app/RESET', null, { root: true })
  },
  CLEAN_EDITING_COMPONENT_SET_ID_BY_IDS(state, ids) {
    toArray(ids).forEach(id => {
      if (id === state.editingComponentSetId) {
        state.editingComponentSetId = null
      }
    })
  },
  RECORD(state, payLoad) {
    if (state.editingComponentSetId) {
      jsonHistory.record(payLoad)
    } else {
      Message.info('Please select an artboard first')
    }
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
  }
}

const actions = {
  async getProjects({ commit }) {
    const { data } = await getProjects()

    commit('SET_NODES_TO_MAP', data)
    commit('SET', { projectIds: data.map(x => x[ID]) })
  },

  async getProject({ commit }, id) {
    const node = state.componentsMap[id]
    if (node) {
      return node
    } else {
      const { data } = await getProject(id)
      commit('SET_NODES_TO_MAP', data)
      return data
    }
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

  async getComponentSet({ commit, state }, id) {
    if (!state.componentsMap[id]) {
      const componentsArray = await getComponentSet(id)
      commit('SET_NODES_TO_MAP', componentsArray)
    }
  },

  async getComponentSets({ commit, state }, projectId) {
    const { data: nodes } = await getComponentSets(projectId)
    commit('SET_NODES_TO_MAP', nodes)
  },

  async createComponentSet(
    { commit, state, dispatch },
    { projectId, componentSet }
  ) {
    const { data } = await createComponentSet(projectId, componentSet)

    // const componentSet = await createComponentSet({
    //   ...node,
    //   [CHILDREN]: createBySelected
    //     ? [rootGetters['app/selectedComponentTree']]
    //     : []
    // })

    dispatch('app/toggleSelectedComponentSetInIds', data.id, { root: true })
    commit('SET_NODES_TO_MAP', data)
  },

  async patchComponentSet({ commit, state, dispatch }, { id, componentSet }) {
    const { data } = await patchComponentSet(id, componentSet)
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

    dispatch('app/cleanSelectedComponentSetIds', ids, { root: true })

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

  const id = objectHasAnyKey(deltaGroup[0])
  const { editingProjectId, componentsMap } = store.state.component
  const node = componentsMap[id]
  const isTop = node.parentId === editingProjectId
  // 代表不是巢狀node tree裡面的 componentSet,是最頂層project下的componentSet
  if (isTop) {
    store.dispatch('app/addSelectedComponentSetInIds', id, { root: true })
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
