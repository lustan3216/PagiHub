import Vue from 'vue'
import { SET } from '../index'
import { TYPE } from '../../const'
import listToTree from '../../utils/listToTree'
import { cloneJson, nestedToLinerObject } from '../../utils/tool'
import { projectIds } from '../../utils/keyId'
import localforage from 'localforage'

const _initTemplate = () => ({
  type: TYPE.PROJECT,
  name: 'Playground',
  description: 'Playground',
  children: [
    {
      type: TYPE.COMPONENT_SET,
      version: 1,
      name: 'Component',
      autoUpdate: true,
      description: 'Playground'
    }
  ]
})

const state = {
  projectMap: []
}

const mutations = {
  SET,
  APPEND_NODE(state, { id, node }) {
    Vue.set(state.projectMap, id, node)
  },
  DELETE_NODE(state, id) {
    Vue.delete(state.projectMap, id)
  }
}

const actions = {
  async getProjects({ commit }) {
    const projectMap = (await localforage.getItem('project')) || {}

    if (Object.hasAnyKey(projectMap)) {
      projectIds.restoreIds(projectMap)
    } else {
      const initTemplate = _initTemplate()
      initTemplate.parentId = 0
      projectIds.appendIdNested(initTemplate)

      nestedToLinerObject(projectMap, initTemplate)
    }

    commit('SET', { projectMap })
  },

  async appendProjectNode({ commit }, _node) {
    const node = { ..._node }
    projectIds.appendIdNested(node)

    commit('APPEND_NODE', { id: node.id, node })
  },

  modifyProjectNodeParent({ commit, state }, { parentId, id }) {
    const node = cloneJson(state.projectMap[id])
    node.parentId = parentId

    commit('APPEND_NODE', { id, node })
  },

  deleteProjectNode({ commit, getters }, id) {
    const ids = [id]
    const grandChildrenRecords = nodeId => {
      getters.childrenOf[nodeId].forEach(child => {
        ids.push(child.id)

        grandChildrenRecords(child.id)
      })
    }

    grandChildrenRecords(id)
    ids.forEach(id => commit('DELETE_NODE', id))
  }
}

const getters = {
  listToTree(state) {
    const value = Object.values(state.projectMap).sort(
      (a, b) => a.type - b.type
    )
    return listToTree(cloneJson(value))
  },
  childrenOf(state, getters) {
    return getters.listToTree.childrenOf
  },
  tree(state, getters) {
    return getters.listToTree.tree
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
