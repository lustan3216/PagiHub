import {
  createWebsite,
  deleteWebsite,
  getWebsite,
  getWebsites,
  patchWebsite
} from '@/api/node'
import { ID } from '@/const'

export const actions = {
  async getWebsites({ commit }) {
    const { data } = await getWebsites()

    commit('SET_NODES_TO_MAP', { nodes: data })
    commit('SET', { projectIds: data.map(x => x[ID]) })
  },

  async getWebsite({ state, commit, dispatch }, id) {
    let node = state.componentsMap[id]

    if (!node) {
      const { data } = await getWebsite(id)
      commit('SET_NODES_TO_MAP', { nodes: data })
      node = data
    }

    commit('SET', {
      rootComponentSetIds: [],
      editingWebsiteId: id
    })
    dispatch('getComponentSets', id)
    return node
  },

  async createWebsite({ commit }, form) {
    const { data } = await createWebsite(form)

    commit('SET_NODES_TO_MAP', { nodes: data })
    return data
  },

  async patchWebsite({ commit }, { id, ...form }) {
    const { data } = await patchWebsite(id, form)
    commit('SET_NODES_TO_MAP', { nodes: data })
  },

  modifyWebsiteNodeParent({ commit, state }, { parentId, id }) {
    commit('APPEND_NODE', {
      id,
      node: {
        ...state.componentsMap[id],
        parentId
      }
    })
  },

  async deleteWebsiteNode({ state, commit, getters, dispatch }, id) {
    await deleteWebsite(id)
    commit('INIT')
  }
}
