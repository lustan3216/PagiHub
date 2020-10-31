import {
  createComponentSet,
  deleteComponentSet,
  getComponentSetChildren,
  patchComponentSet,
  publishComponentSet,
  getComponentSets
} from '@/api/node'

import jsonHistory from '@/store/jsonHistory'
import { background } from '@/templateJson/basic'
import { getCopyComponentIds, getTmpComponentsArray } from '@/store'
import { traversalSelfAndChildren } from '@/utils/node'
import { objectFirstKey } from '@/utils/object'
import { cloneJson } from '@/utils/tool'
import { appendIds } from '@/utils/nodeId'
import draftState from '@/utils/draftStateUploader'
import { DEFAULT_BREAK_POINTS_MAP } from '@/const'

export const actions = {
  async getComponentSets({ commit, state }) {
    const { data } = await getComponentSets({
      parentId: state.editingProjectId
    })

    commit('SET_NODES_TO_MAP', { nodes: data })
    return data
  },

  async getComponentSetChildren({ commit, state }, { id, force = false }) {
    const nodes = Object.values(state.nodesMap)
    const imported = nodes.find(node => node.parentId === id)

    if (imported && !force) {
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
    { commit, state, dispatch, rootGetters },
    { label, description, tags }
  ) {
    const tree = background()
    appendIds(tree)

    const {
      data: { children, ...componentSet }
    } = await createComponentSet({
      parentId: state.editingProjectId,
      description,
      label,
      tags,
      children: tree,
      projectLabel: state.nodesMap[state.editingProjectId].label,
      breakpointsMap: DEFAULT_BREAK_POINTS_MAP
    })

    commit('SET', {
      editingProjectId: componentSet.parentId,
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
    // avoid to get the componentS
    const tree = cloneJson(node.children)
    await draftState.publish(state.editingComponentSetId, tree)
    const { data: versionNode } = await publishComponentSet({
      id: state.editingComponentSetId,
      tree,
      description
    })

    for (const key in versionNode) {
      commit('SOFT_RECORD', {
        path: [state.editingComponentSetId, key],
        value: versionNode[key]
      })
    }
  },

  async deleteComponentSet({ state, commit, getters, dispatch }, id) {
    await deleteComponentSet({ id })
    const node = state.nodesMap[id]

    commit('CLEAN_EDITING_COMPONENT_SET_ID_BY_IDS', id)

    this._vm.$nextTick(() => {
      traversalSelfAndChildren(node, child => {
        commit('VUE_DELETE', {
          tree: state.nodesMap,
          key: child.id
        })

        jsonHistory.cleanDeltas(delta => {
          const key = objectFirstKey(delta)
          return child.id === key
        })
      })
    })
  }
}
