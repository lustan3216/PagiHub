import {
  createComponentSet,
  deleteComponentSet,
  getComponentSetChildren,
  getComponentSets,
  patchComponentSet,
  publishComponentSet
} from '@/api/node'

import jsonHistory from '@/store/jsonHistory'
import { getCopyComponentIds, getTmpComponentsArray } from '@/store'
import { layers } from '@/templateJson/basic'
import { isComponentSet, traversalSelfAndChildren } from '@/utils/node'
import { objectFirstKey } from '@/utils/object'
import { cloneJson } from '@/utils/tool'
import { appendIdsWithoutConnection } from '@/utils/nodeId'
import draftState from '@/utils/draftState'

export const actions = {
  async getComponentSetChildren({ commit, state }, id) {
    const nodes = Object.values(state.componentsMap)
    const imported = nodes.find(node => node.parentId === id)
    if (imported) {
      return
    }

    const componentsArray = await getComponentSetChildren({ id })
    if (componentsArray.length) {
      commit('SET_NODES_TO_MAP', {
        nodes: componentsArray,
        rootComponentSetId: id
      })
      getCopyComponentIds()
      getTmpComponentsArray()
    }
  },

  async getComponentSets({ commit, state }, { projectId, polymorphism }) {
    const nodes = Object.values(state.componentsMap)
    const imported = nodes.find(node => node.parentId === projectId)
    if (imported) {
      return
    }

    const { data: componentSets } = await getComponentSets({
      parentId: projectId,
      polymorphism
    })
    if (
      componentSets[0] &&
      componentSets[0].id &&
      !state.editingComponentSetId
    ) {
      commit('SET_EDITING_COMPONENT_SET_ID', componentSets[0].id)
    }
    commit('SET_NODES_TO_MAP', { nodes: componentSets })
  },

  async createComponentSet(
    { commit, state, dispatch },
    { parentId, label, description, tags, polymorphism }
  ) {
    const tree = layers()
    appendIdsWithoutConnection(tree)
    const {
      data: { children, ...componentSet }
    } = await createComponentSet({
      parentId,
      polymorphism,
      description,
      label,
      tags,
      children: tree
    })
    commit('SET_EDITING_COMPONENT_SET_ID', componentSet.id)
    commit('SET_NODES_TO_MAP', {
      nodes: [componentSet, ...children],
      rootComponentSetId: componentSet.id
    })
  },

  async patchComponentSet(
    { commit, state, dispatch },
    { id, description, label, tags }
  ) {
    const { data } = await patchComponentSet({
      id,
      body: {
        description,
        label,
        tags
      }
    })
    commit('SET_NODES_TO_MAP', { nodes: data })
  },

  async publishComponentSet({ commit, state }, description) {
    const node = state.componentsMap[state.editingComponentSetId]
    const tree = cloneJson(node)
    await draftState.publish(state.editingComponentSetId, tree)
    const { data: versionNode } = await publishComponentSet({
      id: state.editingComponentSetId,
      tree,
      description
    })
    commit('SOFT_RECORD', {
      path: `${versionNode.id}.version`,
      value: versionNode.version
    })
  },

  async deleteComponentSet({ state, commit, getters, dispatch }, id) {
    await deleteComponentSet({ id })
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
