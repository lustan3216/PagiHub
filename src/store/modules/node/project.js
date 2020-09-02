import {
  createProject,
  deleteProject,
  getProjects,
  patchProject
} from '@/api/node'
import { isComponentSet, isProject } from '@/utils/node'

export const actions = {
  async getProjects({ commit }) {
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

    commit('SET_NODES_TO_MAP', { nodes })
    commit('SET', { projectIds, rootComponentSetIds })
  },

  async createProject({ commit }, form) {
    const { data } = await createProject(form)

    commit('SET', { editingProjectId: data.id })
    commit('SET_NODES_TO_MAP', { nodes: data })
    return data
  },

  async patchProject({ commit }, { id, ...form }) {
    const { data } = await patchProject({ id, ...form })
    commit('SET_NODES_TO_MAP', { nodes: data })
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
    await deleteProject({ id })
    commit('INIT')
  }
}
