import {
  createProject,
  deleteProject,
  getProjects,
  patchProject,
  getProject
} from '@/api/node'
import { isComponentSet, isProject } from '@/utils/node'
import jsonHistory from '@/store/jsonHistory'
import { arraySubtract } from '@/utils/array'

export const actions = {
  async getProjects({ state, commit }) {
    const { data: nodes } = await getProjects()
    const projectIds = []
    const rootComponentSetIds = []

    nodes.forEach(node => {
      if (isProject(node)) {
        projectIds.push(node.id)
      }
      else if (isComponentSet(node)) {
        rootComponentSetIds.push(node.id)
      }
    })

    jsonHistory.tree = state.nodesMap
    commit('SET_NODES_TO_MAP', { nodes })
    commit('SET', { projectIds, rootComponentSetIds })
  },

  async createProject({ commit }, params) {
    const { data } = await createProject(params)

    commit('SET', { editingProjectId: data.id })
    commit('SET_NODES_TO_MAP', { nodes: data })
    return data
  },

  async getProject({ commit, state }, id) {
    const { data } = await getProject({ id })

    commit('SET_NODES_TO_MAP', { nodes: data })
    commit('SET', { editingProjectId: id })

    return data
  },

  async patchProject({ commit }, params) {
    const { data } = await patchProject(params)
    commit('SET_NODES_TO_MAP', { nodes: data })
  },

  modifyProjectNodeParent({ commit, state }, { parentId, id }) {
    commit('APPEND_NODE', {
      id,
      node: {
        ...state.nodesMap[id],
        parentId
      }
    })
  },

  async deleteProjectNode({ state, commit, getters, dispatch }, id) {
    await deleteProject({ id })
    if (state.editingProjectId === id) {
      commit('SET', {
        editingProjectId: null,
        editingComponentSetId: null,
        projectIds: arraySubtract(state.projectIds, id),
        rootComponentSetIds: []
      })

      jsonHistory.deltas = []
      jsonHistory.currentIndex = 0
    }
  }
}
