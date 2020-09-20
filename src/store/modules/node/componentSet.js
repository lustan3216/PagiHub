import {
  createComponentSet,
  deleteComponentSet,
  getComponentSetChildren,
  patchComponentSet,
  publishComponentSet
} from '@/api/node'

import jsonHistory from '@/store/jsonHistory'
import { gridGenerator } from '@/templateJson/basic'
import { getCopyComponentIds, getTmpComponentsArray } from '@/store'
import { isComponentSet, traversalSelfAndChildren } from '@/utils/node'
import { objectFirstKey } from '@/utils/object'
import { cloneJson } from '@/utils/tool'
import { appendIds } from '@/utils/nodeId'
import draftState from '@/utils/draftStateUploader'
import { DEFAULT_BREAK_POINTS_MAP } from '@/const'

export const actions = {
  async getComponentSetChildren({ commit, state }, id) {
    const nodes = Object.values(state.nodesMap)
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

  async createComponentSet(
    { commit, state, dispatch },
    { parentId, label, description, tags }
  ) {
    const tree = gridGenerator()
    appendIds(tree)
    const {
      data: { children, ...componentSet }
    } = await createComponentSet({
      parentId,
      description,
      label,
      tags,
      children: tree,
      breakpointsMap: DEFAULT_BREAK_POINTS_MAP
    })

    commit('SET', {
      editingProjectId: parentId,
      editingComponentSetId: componentSet.id
    })

    commit('SET_NODES_TO_MAP', {
      nodes: [componentSet, ...children],
      rootComponentSetId: componentSet.id
    })
  },

  async patchComponentSet({ commit, state, dispatch }, params) {
    if (!state.editingComponentSetId) {
      return
    }

    if (!params.id) {
      params.id = state.editingComponentSetId
    }

    const { data } = await patchComponentSet(params)
    commit('SET_NODES_TO_MAP', { nodes: data })
  },

  async publishComponentSet({ commit, state }, description) {
    const node = state.nodesMap[state.editingComponentSetId]
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
    const node = state.nodesMap[id]

    traversalSelfAndChildren(node, child => {
      commit('VUE_DELETE', {
        tree: state.nodesMap,
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
