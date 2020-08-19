import {
  createComponentSet,
  deleteComponentSet,
  getComponentSetChildren, getComponentSets,
  patchComponentSet
} from '@/api/node'
import { recordRootComponentSetIdByArray } from '@/utils/rootComponentSetId'
import { getCopyComponentIds, getTmpComponentsArray } from '@/store'
import { vmAddNodesToParentAndRecord } from '@/utils/vmMap'
import { componentBody } from '@/templateJson/basic'
import { isComponentSet, traversalChildren, traversalSelfAndChildren } from '@/utils/node'
import jsonHistory from '@/store/jsonHistory'
import { objectFirstKey } from '@/utils/tool'

export const actions = {
  async getComponentSetChildren({ commit, state }, id) {
    const componentsArray = await getComponentSetChildren(id)
    if (componentsArray.length) {
      commit('SET_NODES_TO_MAP', componentsArray)
      recordRootComponentSetIdByArray(id, componentsArray)
      getCopyComponentIds()
      getTmpComponentsArray()
    }
    else {
      vmAddNodesToParentAndRecord(id, componentBody())
      const componentSet = state.componentsMap[id]
      const ids = []

      traversalChildren(componentSet, ({ id }) => {
        ids.push(id)
      })

      jsonHistory.cleanDeltas(delta => {
        const key = objectFirstKey(delta)
        return ids.includes(key)
      })
    }
  },

  async getComponentSets({ commit, state }, projectId) {
    const { data: nodes } = await getComponentSets(projectId)
    commit('SET_NODES_TO_MAP', nodes)
    if (nodes[0] && nodes[0].id) {
      commit('SET_EDITING_COMPONENT_SET_ID', nodes[0].id)
    }
  },

  async createComponentSet({ commit, state, dispatch }, { projectId, attrs }) {
    const { data } = await createComponentSet(projectId, attrs)
    commit('SET_EDITING_COMPONENT_SET_ID', data.id)
    commit('SET_NODES_TO_MAP', data)
  },

  async patchComponentSet({ commit, state, dispatch }, { id, attrs }) {
    const { data } = await patchComponentSet(id, attrs)
    commit('SET_NODES_TO_MAP', data)
  },

  async deleteComponentSet({ state, commit, getters, dispatch }, id) {
    await deleteComponentSet(id)
    const node = state.componentsMap[id]
    const ids = []

    traversalSelfAndChildren(node, child => {
      ids.push(child.id)
      commit('DELETE_NODE', id)

      if (isComponentSet(node)) {
        commit('CLEAN_EDITING_COMPONENT_SET_ID_BY_IDS', id)
      }
    })

    jsonHistory.cleanDeltas(delta => {
      const key = objectFirstKey(delta)
      return ids.includes(key)
    })
  }
}
