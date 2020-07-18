import Vue from 'vue'
import localforage from 'localforage'
import listToTree from '@/utils/listToTree'
import { SET, VUE_SET } from '../index'
import { CHILDREN, NODE_TYPE, KIND } from '@/const'
import { cloneJson, nestedToLinerObject } from '@/utils/tool'
import {
  getProjects,
  createProject,
  patchProject,
  deleteProject,
  getComponentSet,
  getComponentSets,
  createComponentSet
} from '@/api/node'
import { resetJsonHistory } from '@/store/jsonHistory'

const state = {
  projectMap: {},
  editingProjectId: null
}

const mutations = {
  SET,
  VUE_SET,
  APPEND_COMPONENT_SET(state, { id, parentId }) {
    const parentNode = state.projectMap[parentId]
    parentNode[CHILDREN] = parentNode[CHILDREN] || []
    parentNode[CHILDREN].push({
      id,
      type: NODE_TYPE.COMPONENT_SET
    })
  },
  PUT_NODE(state, node) {
    Vue.set(state.projectMap, node.id, node)
  },
  DELETE_NODE(state, id) {
    Vue.delete(state.projectMap, id)
  }
}

const actions = {
  async getProjects({ commit }) {
    const { data } = await getProjects()

    commit('SET', {
      projectMap: nestedToLinerObject(data)
    })
  },

  async createProject({ commit }, form) {
    const { data } = await createProject(form)

    commit('PUT_NODE', data)
    return data
  },

  async patchProject({ commit }, { id, ...form }) {
    const { data } = await patchProject(id, form)

    commit('PUT_NODE', data)
  },

  async getComponentSet({ commit, state }, id) {
    if (!state.projectMap[id]) {
      const componentsArray = await getComponentSet(id)
      commit('PUT_NODE', componentsArray)
    }
  },

  async getComponentSets({ commit, state }, projectId) {
    const { data } = await getComponentSets(projectId)
    data.forEach(node => commit('PUT_NODE', node))
  },

  async createComponentSet({ commit, state }, { projectId, componentSet }) {
    const { data } = await createComponentSet(projectId, componentSet)
    commit('PUT_NODE', data)
  },
  // async getProject({ commit }) {
  //   const projectMap = await getProject()
  //   commit('SET', { projectMap })
  //
  //   nodeIds.restoreIds(Object.values(projectMap))
  //   const componentSetId = await localforage.getItem('editingComponentSetId')
  //   commit('component/SET_EDITING_COMPONENT_SET_ID', componentSetId, { root: true })
  // },

  modifyProjectNodeParent({ commit, state }, { parentId, id }) {
    commit('APPEND_NODE', {
      id,
      node: {
        ...state.projectMap[id],
        parentId
      }
    })
  },

  async deleteProjectNode({ state, commit, getters, dispatch, rootState }, id) {
    await deleteProject(id)
    const ids = [id]
    const gatherGrandChildrenIds = nodeId => {
      getters.childrenOf[nodeId].forEach(child => {
        ids.push(child.id)

        gatherGrandChildrenIds(child.id)
      })
    }

    gatherGrandChildrenIds(id)

    commit('app/CLEAN_SELECTED_COMPONENT_SET_IDS', ids, { root: true })

    /* TODO 這裡怪怪的*/
    const { editingComponentSetId } = rootState.components
    ids.forEach(id => {
      if (state.projectMap[id].type === NODE_TYPE.COMPONENT_SET) {
        if (editingComponentSetId === id) {
          commit('component/SET_EDITING_COMPONENT_SET_ID', null, { root: true })
        }
        resetJsonHistory(id)
      }
    })

    ids.forEach(id => commit('DELETE_NODE', id))
  }
}

const getters = {
  listToTree(state) {
    const nodes = Object.values(state.projectMap).filter(x => x[KIND] === 'c')
    const value = nodes.sort((a, b) => a.type - b.type)

    return listToTree(cloneJson(value), state.editingProjectId)
  },
  childrenOf(state, getters) {
    return getters.listToTree.childrenOf
  },
  tree(state, getters) {
    return getters.listToTree.tree
  }
}

const subscribe = {
  updateProjectMap(mutation, state) {
    if (
      [
        'project/SET',
        'project/APPEND_NODE',
        'project/DELETE_NODE',
        'project/VUE_SET'
      ].includes(mutation.type)
    ) {
      localforage.setItem('project', state.project.projectMap)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
  subscribe
}
