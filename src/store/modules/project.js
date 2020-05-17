import Vue from 'vue'
import { SET } from '../index'
import { CHILDREN, NODE_TYPE } from '@/const'
import listToTree from '@/utils/listToTree'
import { cloneJson } from '@/utils/tool'
import { getProject, createComponentSet, createFolder } from '@/api/project'
import localforage from 'localforage'

const state = {
  projectMap: {}
}

const mutations = {
  SET,
  APPEND_NODE(state, { id, node: { children: _, ...node }}) {
    Vue.set(state.projectMap, id, node)
  },
  DELETE_NODE(state, id) {
    Vue.delete(state.projectMap, id)
  }
}

const actions = {
  async getProjects({ commit, dispatch }) {
    const projectMap = await getProject()
    commit('SET', { projectMap: projectMap })
    const componentSetId = await localforage.getItem('editingComponentSetId')
    dispatch('component/setComponentSet', componentSetId, { root: true })
  },

  async appendProjectNode(
    { dispatch, commit, state, rootGetters },
    { createBySelected, exampleComponentId, ...node }
  ) {
    switch (node.type) {
      case NODE_TYPE.COMPONENT_SET:
        const componentSet = await createComponentSet({
          ...node,
          [CHILDREN]: [
            createBySelected
              ? rootGetters['app/selectedComponentTree']
              : rootGetters['example/basicMapById'][exampleComponentId]
          ]
        })

        dispatch('component/setComponentSet', componentSet.id, { root: true })
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

  deleteProjectNode({ commit, getters, dispatch }, id) {
    const ids = [id]
    const grandChildrenRecords = nodeId => {
      getters.childrenOf[nodeId].forEach(child => {
        ids.push(child.id)

        grandChildrenRecords(child.id)
      })
    }
    grandChildrenRecords(id)
    dispatch('component/removeComponentSet', id, { root: true })
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
      ['project/SET', 'project/APPEND_NODE', 'project/DELETE_NODE'].includes(
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

