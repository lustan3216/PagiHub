import Vue from 'vue'
import localforage from 'localforage'
import listToTree from '@/utils/listToTree'
import { SET, VUE_SET } from '../index'
import { CHILDREN, NODE_TYPE } from '@/const'
import { cloneJson } from '@/utils/tool'
import { getProject, createFolder } from '@/api/project'
import { resetJsonHistory } from '@/store/jsonHistory'
import { nodeIds } from '@/utils/nodeId'

const state = {
  projectMap: {}
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
  APPEND_FOLDER(state, { id, node: { children: _, ...node }}) {
    Vue.set(state.projectMap, id, node)
  },
  DELETE_NODE(state, id) {
    Vue.delete(state.projectMap, id)
  }
}

const actions = {
  async getProjects({ commit }) {
    const projectMap = await getProject()
    commit('SET', { projectMap: projectMap })

    nodeIds.restoreIds(Object.values(projectMap))
    const componentSetId = await localforage.getItem('editingComponentSetId')
    commit('component/SET_EDITING_COMPONENT_SET_ID', componentSetId, { root: true })
  },

  async createFolder({ commit }, node) {
    const folder = await createFolder(node)
    commit('APPEND_FOLDER', { id: folder.id, node: folder })
  },

  modifyProjectNodeParent({ commit, state }, { parentId, id }) {
    commit('APPEND_NODE', {
      id,
      node: {
        ...state.projectMap[id],
        parentId
      }
    })
  },

  deleteProjectNode({ state, commit, getters, dispatch }, id) {
    const ids = [id]
    const gatherGrandChildrenIds = nodeId => {
      getters.childrenOf[nodeId].forEach(child => {
        ids.push(child.id)

        gatherGrandChildrenIds(child.id)
      })
    }

    gatherGrandChildrenIds(id)

    commit('app/CLEAN_SELECTED_COMPONENT_SET_IDS', ids, { root: true })

    ids.forEach(id => {
      if (state.projectMap[id].type === NODE_TYPE.COMPONENT_SET) {
        dispatch('component/removeComponentSet', id, { root: true })
        resetJsonHistory(id)
      }
    })

    ids.forEach(id => commit('DELETE_NODE', id))
  }
}

const getters = {
  listToTree(state) {
    const nodes = Object.values(state.projectMap)
    const value = nodes.sort((a, b) => a.type - b.type)

    return listToTree(cloneJson(value))
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
      ['project/SET', 'project/APPEND_NODE', 'project/DELETE_NODE', 'project/VUE_SET'].includes(
        mutation.type
      )
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

