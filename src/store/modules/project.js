import Vue from 'vue'
import localforage from 'localforage'
import listToTree from '@/utils/listToTree'
import { SET, VUE_SET } from '../index'
import { CHILDREN, NODE_TYPE } from '@/const'
import { cloneJson } from '@/utils/tool'
import { getProject, createFolder } from '@/api/project'
import { createComponentSet } from '@/api/componentSet'
import { resetJsonHistory } from '@/store/jsonHistory'
import { nodeIds } from '@/utils/nodeId'

const state = {
  projectMap: {}
}

const mutations = {
  SET,
  VUE_SET,
  APPEND_NODE(state, { id, node: { children: _, ...node }}) {
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

  async appendProjectNode(
    { dispatch, commit, state, rootGetters, rootState },
    { createBySelected, ...node }
  ) {
    switch (node.type) {
      case NODE_TYPE.COMPONENT_SET:
        const componentSet = await createComponentSet({
          ...node,
          [CHILDREN]: createBySelected
            ? [rootGetters['app/selectedComponentTree']]
            : []
        })

        commit('app/TOGGLE_SELECTED_COMPONENT_SET_IN_IDS', componentSet.id, { root: true })
        commit('component/SET_EDITING_COMPONENT_SET_ID', componentSet.id, { root: true })
        commit('APPEND_NODE', { id: componentSet.id, node: componentSet })
        break

      case NODE_TYPE.FOLDER:
        const folder = await createFolder(node)
        commit('APPEND_NODE', { id: folder.id, node: folder })
        break
    }
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

