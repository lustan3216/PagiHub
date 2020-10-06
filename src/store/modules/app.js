import { SET } from '../index'
import { arraySubtract, toArray } from '@/utils/array'
import { cloneJson } from '@/utils/tool'
import {
  isComponent,
  traversalAncestorAndSelf,
  traversalChildren
} from '@/utils/node'

const state = {
  beingAddedComponentId: null,
  selectedComponentIds: [],
  copyComponentIds: [],
  dialog: null
}

const mutations = {
  SET,
  DIALOG_OPEN(state, name) {
    state.dialog = `dialog-${name}`
  },
  DIALOG_CLOSE(state) {
    state.dialog = null
  },
  RESET(state) {
    state.selectedComponentIds = []
    state.copyComponentIds = []
  },
  CLEAN_SELECTED_COMPONENT_ID(state, ids) {
    state.selectedComponentIds = arraySubtract(state.selectedComponentIds, ids)
  },
  SET_SELECTED_COMPONENT_ID(state, id) {
    if (state.selectedComponentIds !== [id]) {
      state.selectedComponentIds = [id]
    }
  },
  TOGGLE_SELECTED_COMPONENT_ID(state, id) {
    const isExist = state.selectedComponentIds.includes(id)
    state.selectedComponentIds = isExist ? [] : [id]
  },
  TOGGLE_SELECTED_COMPONENT_IN_IDS(state, id) {
    const isExist = state.selectedComponentIds.includes(id)
    if (isExist) {
      state.selectedComponentIds = arraySubtract(state.selectedComponentIds, id)
    }
    else {
      state.selectedComponentIds.push(id)
    }
  }
}

let tmpSelectedComponentIds
const actions = {
  setBeingAddedComponentId({ commit, state }, id) {
    commit('DIALOG_OPEN', 'ComponentTabs')
    // 打開DialogComponentTabs 新增example時，原本draft上的selected component會跟example裡面的混在一起
    // 打開時先暫時刪除，關掉時存回去
    tmpSelectedComponentIds = state.selectedComponentIds
    commit('SET', {
      beingAddedComponentId: id,
      selectedComponentIds: []
    })
  },
  removeBeingAddedComponentId({ commit }) {
    commit('DIALOG_CLOSE')

    commit('SET', {
      beingAddedComponentId: null,
      selectedComponentIds: tmpSelectedComponentIds
    })
  },
  setCopySelectedNodeId({ commit, state, rootState }, ids) {
    const { rootComponentSetIds, nodesMap } = rootState.node
    const copyComponentIds = ids
      ? toArray(ids)
      : state.selectedComponentIds.filter(
        id => !rootComponentSetIds.includes(id)
      )

    // the top component under rootComponentSet should not be copied
    const copyNodeArray = []
    copyComponentIds.forEach(id => {
      const node = nodesMap[id]
      traversalAncestorAndSelf(node, node => {
        if (isComponent(node)) {
          copyNodeArray.push(node)
        }
        else {
          return false
        }
      })
      traversalChildren(node, node => {
        copyNodeArray.push(node)
      })
    })

    localStorage.setItem('copyComponentIds', JSON.stringify(copyComponentIds))
    localStorage.setItem('tmpComponentsArray', JSON.stringify(copyNodeArray))
    commit('SET', { copyComponentIds })
    commit('node/SET_NODES_TO_TMP_MAP', cloneJson(copyNodeArray), {
      root: true
    })
    return copyComponentIds
  }
}

const getters = {
  theOnlySelectedComponentId(state) {
    if (state.selectedComponentIds.length === 1) {
      return state.selectedComponentIds[0]
    }
  },
  selectedComponentNodes(state, getters, rootState) {
    return state.selectedComponentIds
      .map(id => rootState.node.nodesMap[id])
      .filter(node => node)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
