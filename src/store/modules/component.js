import Vue from 'vue'
import app from '@/main'
import jsonHistory, { cleanJsonHistoryById } from '../jsonHistory'
import store, { SET } from '../index'
import {
  createComponentSet,
  createProject,
  deleteProject,
  getComponentSet,
  getComponentSets,
  getProjects,
  patchProject,
  getProject
} from '@/api/node'
import { objectHasAnyKey, findBy, forEach, deleteBy, toArray } from '@/utils/tool'
import { nodeIds } from '@/utils/nodeId'
import { Message } from 'element-ui'
import { CHILDREN, ID, KIND, NODE_TYPE, PARENT_ID } from '@/const'
import { isComponent, isComponentSet } from '@/utils/node'

const childrenOf = {}

const state = {
  editingProjectId: null,
  editingComponentSetId: null,
  componentsMap: {}
}

const mutations = {
  SET,
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

        defineNodeProperty(value)
        Vue.set(componentsMap, key, value)
      } else {
        Vue.set(tree, key, value)
      }
    }
  },
  SET_NODES_TO_MAP(state, componentsArray) {
    forEach(componentsArray, node => {
      const { editingProjectId, editingComponentSetId } = state
      const id = node[ID]
      let parentId = node[PARENT_ID]

      if (!parentId) {
        if (isComponentSet(node)) {
          parentId = editingProjectId
        } else if (isComponent(node)) {
          parentId = editingComponentSetId
        }
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

      Vue.set(state.componentsMap, id, node)
      defineNodeProperty(node)
    })
  },
  RECORD(state, payLoad) {
    if (state.editingComponentSetId) {
      jsonHistory.record(payLoad)
    } else {
      Message.info('Please select an artboard first')
    }
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
  async REDO() {
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
  DELETE_NODE(state, id) {
    Vue.delete(state.componentsMap, id)
  }
}

const actions = {
  async getProjects({ commit }) {
    const { data } = await getProjects()

    commit('SET_NODES_TO_MAP', data)
  },

  async getProject({ commit }, id) {
    if (!state.componentsMap[id]) {
      const { data } = await getProject(id)
      commit('SET_NODES_TO_MAP', data)
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

  async createComponentSet({ commit, state, dispatch }, { projectId, componentSet }) {
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
  // async getProject({ commit }) {
  //   const componentsMap = await getProject()
  //   commit('SET', { componentsMap })
  //
  //   nodeIds.restoreIds(Object.values(componentsMap))
  //   const componentSetId = await localforage.getItem('editingComponentSetId')
  //   commit('component/SET_EDITING_COMPONENT_SET_ID', componentSetId, { root: true })
  // },

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
    const ids = [id]
    const gatherGrandChildrenIds = nodeId => {
      getters.childrenOf[nodeId].forEach(child => {
        ids.push(child.id)

        gatherGrandChildrenIds(child.id)
      })
    }

    gatherGrandChildrenIds(id)

    dispatch('app/cleanSelectedComponentSetIds', ids, { root: true })

    ids.forEach(id => {
      if (state.componentsMap[id][KIND] === NODE_TYPE.COMPONENT_SET) {
        commit('CLEAN_EDITING_COMPONENT_SET_ID_BY_IDS', id)
        cleanJsonHistoryById(id)
      }
      commit('DELETE_NODE', id)
    })
  }
}

const getters = {}

function defineNodeProperty(node) {
  const defined = 'parentNode' in node
  if (!defined) {
    Object.defineProperty(node, 'parentNode', {
      get() {
        return store.state.componentsMap[this.parentId]
      },
      enumerable: false
    })
  }
}

function rollbackSelectedComponentSet(deltaGroup) {
  if (!deltaGroup) {
    return false
  }

  const id = objectHasAnyKey(deltaGroup[0])
  const { componentSetId } = nodeIds.departId(id)
  const { selectedComponentSetIds } = store.state.app
  const isExist = selectedComponentSetIds.includes(componentSetId)

  if (!isExist) {
    store.commit('component/SET_EDITING_COMPONENT_SET_ID', componentSetId)
    store.commit('app/SET', {
      selectedComponentSetIds: [...selectedComponentSetIds, componentSetId]
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
