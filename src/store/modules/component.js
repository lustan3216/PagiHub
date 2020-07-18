import app from '@/main'
import localforage from 'localforage'
import jsonHistory from '../jsonHistory'
import store, { SET } from '../index'
import {
  createComponentSet
} from '@/api/node'
import { isUndefined, objectHasAnyKey, traversal, deleteBy } from '@/utils/tool'
import { nodeIds } from '@/utils/nodeId'
import { Message } from 'element-ui'
import { all, basicComponentsMap } from '@/templateJson'
import { CHILDREN, ID, PARENT_ID } from '@/const'
import Vue from 'vue'

const childrenOf = {}

const state = {
  basicExamples: all,
  editingComponentSetId: null,
  componentsMap: basicComponentsMap
}

function rollbackSelectedComponentSet(deltaGroup) {
  if (!deltaGroup) {
    return Promise.reject()
  }

  const id = objectHasAnyKey(deltaGroup[0])
  const { componentSetId } = nodeIds.departId(id)
  const { selectedComponentSetIds } = store.state.app
  const isExist = selectedComponentSetIds.includes(componentSetId)

  if (!isExist) {
    store.commit('component/SET_EDITING_COMPONENT_SET_ID', componentSetId)
    store.commit('app/SET', {
      selectedComponentSetIds: [...selectedComponentSetIds, componentSetId]
    })
  }

  return Promise.resolve()
}

const mutations = {
  SET,
  VUE_SET({ componentsMap }, { tree, key, value }) {
    if (isUndefined(value)) {
      if (tree[key][ID]) {
        const parentId = componentsMap[key][PARENT_ID]
        const parentNode = componentsMap[parentId]
        if (parentNode) {
          deleteBy(parentNode[CHILDREN], 'id', key)
        }
      }

      Vue.delete(tree, key)
    } else if (tree[key] && tree.__ob__) {
      tree[key] = value
    } else {
      if (value[ID]) {
        childrenOf[key] = value[CHILDREN] =
          childrenOf[key] || value[CHILDREN] || []

        const parentId = value[PARENT_ID]
        childrenOf[parentId] = childrenOf[parentId] || []
        childrenOf[parentId].push(value)

        defineNodeProperty(value)
      }
      Vue.set(tree, key, value)
    }
  },
  RECORD(state, payLoad) {
    if (state.editingComponentSetId) {
      jsonHistory.record(payLoad)
    } else {
      Message.info('Please select an artboard first')
    }
  },
  SET_EDITING_COMPONENT_SET_ID(state, id) {
    state.editingComponentSetId = id
    // store.commit('app/RESET', null, { root: true })
  },
  async REDO() {
    await rollbackSelectedComponentSet(jsonHistory.nextRedoDeltaGroup)
    app.$nextTick(() => {
      jsonHistory.redo()
    })
  },
  async UNDO() {
    await rollbackSelectedComponentSet(jsonHistory.nextUndoDeltaGroup)
    app.$nextTick(() => {
      jsonHistory.undo()
    })
  },
  SET_MAP(state, componentsArray) {
    const map = {}
    let id
    let parentId

    traversal(componentsArray, node => {
      id = node[ID]
      parentId = node[PARENT_ID] || 0

      childrenOf[id] = childrenOf[id] || []
      node[CHILDREN] = childrenOf[id]

      if (parentId !== 0) {
        childrenOf[parentId] = childrenOf[parentId] || []
        childrenOf[parentId].push(node)
      }

      map[id] = node
    })

    componentsArray.forEach(node => defineNodeProperty(node))

    const componentsMap = { ...state.componentsMap, ...map }

    state.componentsMap = componentsMap
    jsonHistory.tree = componentsMap
  }
}

const actions = {
  async createComponentSet(
    { dispatch, commit, state, rootGetters, rootState },
    { createBySelected, ...node }
  ) {
    const componentSet = await createComponentSet({
      ...node,
      [CHILDREN]: createBySelected
        ? [rootGetters['app/selectedComponentTree']]
        : []
    })

    commit('app/TOGGLE_SELECTED_COMPONENT_SET_IN_IDS', componentSet.id, {
      root: true
    })
    commit('SET_EDITING_COMPONENT_SET_ID', componentSet.id)
    commit('project/APPEND_COMPONENT_SET', componentSet, { root: true })
  }
}

const getters = {}

const subscribe = {
  updateNodesMap(mutation, state) {
    if (
      ['component/RECORD', 'component/REDO', 'component/ UNDO'].includes(
        mutation.type
      )
    ) {
      const nodes = []
      const { editingComponentSetId } = state.component
      const tree = state.component.componentsMap[editingComponentSetId]

      traversal(tree, ({ children, ...node }) => {
        nodes.push(node)
      })
      localforage.setItem(editingComponentSetId, nodes)
    }
  },

  editingComponentSetId(mutation, state) {
    if (mutation.type === ['component/SET_EDITING_COMPONENT_SET_ID']) {
      localforage.setItem(
        'editingComponentSetId',
        state.component.editingComponentSetId
      )
    }
  }
}

function defineNodeProperty(node) {
  Object.defineProperty(node, 'parentNode', {
    get() {
      return store.state.componentsMap[this.parentId]
    },
    enumerable: false
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
  subscribe
}
