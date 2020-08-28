import {
  createComponentSet,
  deleteComponentSet,
  getComponentSetChildren,
  getComponentSets,
  patchComponentSet,
  publishComponentSet
} from '@/api/node'
import { getCopyComponentIds, getTmpComponentsArray } from '@/store'
import { layers } from '@/templateJson/basic'
import { isComponentSet, traversalSelfAndChildren } from '@/utils/node'
import jsonHistory from '@/store/jsonHistory'
import { cloneJson, objectFirstKey } from '@/utils/tool'
import { appendIdNested } from '@/utils/nodeId'
import draftState from '@/utils/draftState'

export const actions = {
  async getComponentSetChildren({ commit, state }, id) {
    const nodes = Object.values(state.componentsMap)
    const imported = nodes.find(node => node.parentId === id)
    if (imported) {
      return
    }

    commit('SET_EDITING_COMPONENT_SET_ID', id)

    const componentsArray = await getComponentSetChildren(id)
    if (componentsArray.length) {
      commit('SET_NODES_TO_MAP', { nodes: componentsArray })
      getCopyComponentIds()
      getTmpComponentsArray()
    }
  },

  async getComponentSets({ commit, state }, projectId) {
    const { data: nodes } = await getComponentSets(projectId)
    if (nodes[0] && nodes[0].id) {
      commit('SET_EDITING_COMPONENT_SET_ID', nodes[0].id)
    }
    commit('SET_NODES_TO_MAP', { nodes })
  },

  async createComponentSet(
    { commit, state, dispatch },
    { projectId, label, description, tags }
  ) {
    const tree = layers()
    appendIdNested(tree)
    const {
      data: { children, ...componentSet }
    } = await createComponentSet(projectId, {
      description,
      label,
      tags,
      children: tree
    })
    commit('SET_EDITING_COMPONENT_SET_ID', componentSet.id)
    commit('SET_NODES_TO_MAP', { nodes: [componentSet, ...children], rootComponentSetId: componentSet.id })
  },

  async patchComponentSet(
    { commit, state, dispatch },
    { id, description, label, tags }
  ) {
    const { data } = await patchComponentSet(id, {
      description,
      label,
      tags
    })
    commit('SET_NODES_TO_MAP', { nodes: data })
  },

  async publishComponentSet({ commit, state }, description) {
    const node = state.componentsMap[state.editingComponentSetId]
    const tree = cloneJson(node)
    await draftState.publish(tree)
    const { data: versionNode } = await publishComponentSet(
      state.editingComponentSetId,
      tree,
      description
    )
    commit('SOFT_RECORD', {
      path: `${versionNode.id}.version`,
      value: versionNode.version
    })
  },

  async deleteComponentSet({ state, commit, getters, dispatch }, id) {
    await deleteComponentSet(id)
    const node = state.componentsMap[id]

    traversalSelfAndChildren(node, child => {
      commit('VUE_DELETE', {
        tree: state.componentsMap,
        key: child.id
      })

      if (isComponentSet(child)) {
        commit('CLEAN_EDITING_COMPONENT_SET_ID_BY_IDS', child.id)
      }

      jsonHistory.cleanDeltas(delta => {
        const key = objectFirstKey(delta)
        return child.id === key
      })
    })
  }
}
