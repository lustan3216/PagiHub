import { SET } from '../index'
import { quickFnMap } from '@/components/TemplateUtils/ComponentQuickFunctions'
import { findBreakpoint, sortDescBreakpoint } from '@/utils/layout'

const state = {
  gridResizing: false,
  artBoardWidth: 0,
  artBoardHeight: 0,
  scaleRatio: 1
}

const mutations = {
  SET
}

const actions = {
  resizeNodeQuickFn({ rootState, commit }) {
    this._vm.$nextTick(() => {
      rootState.app.selectedComponentIds.forEach(id => {
        if (quickFnMap[id]) {
          quickFnMap[id].resize()
        }
      })

      commit('SET', { gridResizing: false })
    })
  }
}

const getters = {
  breakpointsMap(state, getters, rootState) {
    const { nodesMap, editingComponentSetId } = rootState.node
    const node = nodesMap[editingComponentSetId]
    return (node && node.breakpointsMap) || {}
  },
  breakpoints(state, getters) {
    return sortDescBreakpoint(Object.keys(getters.breakpointsMap))
  },
  currentBreakpoint({ artBoardWidth: width }, { breakpointsMap }) {
    return findBreakpoint(breakpointsMap, width)
  },
  vh(state) {
    return state.artBoardHeight / 100
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
