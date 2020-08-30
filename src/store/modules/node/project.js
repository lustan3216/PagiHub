import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  patchProject
} from '@/api/node'
import { ID } from '@/const'

export const actions = {
  async getProjects({ commit }) {
    const { data } = await getProjects()
    const projectIds = data.map(x => x[ID])
    commit('SET_NODES_TO_MAP', { nodes: data })
    commit('SET', { projectIds })
  },

  async getProject({ state, commit, dispatch }, id) {
    let node = state.componentsMap[id]

    if (!node) {
      const { data } = await getProject({ id })
      commit('SET_NODES_TO_MAP', { nodes: data })
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
    const { data } = await createProject({ body: form })

    commit('SET', { editingProjectId: data.id })
    commit('SET_NODES_TO_MAP', { nodes: data })
    return data
  },

  async patchProject({ commit }, { id, ...form }) {
    const { data } = await patchProject({ id, body: form })
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
