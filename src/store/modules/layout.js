import { SET } from '../index'
import { findBreakpoint, sortDescBreakpoint } from '@/utils/layout'
import { BREAK_POINTS_MAP } from '@/const'

const state = {
  gridResizing: false,
  windowWidth: 0,
  windowHeight: 0,
  backgroundHeight: 0,
  scaleRatio: 1
}

const mutations = {
  SET
}

const actions = {
  resizeNodeQuickFn({ commit }) {
    this._vm.$nextTick(() => {
      this._vm.$bus.$emit('quick-function-resize')
      commit('SET', { gridResizing: false })
    })
  }
}

const getters = {
  breakpointsMap(state, getters, rootState) {
    const { nodesMap, editingComponentSetId } = rootState.node
    const node = nodesMap[editingComponentSetId]
    return (node && node.breakpointsMap) || BREAK_POINTS_MAP
  },
  descBreakpoints(state, getters) {
    return sortDescBreakpoint(Object.keys(getters.breakpointsMap))
  },
  currentBreakpoint({ windowWidth: width }, { breakpointsMap }) {
    return findBreakpoint(breakpointsMap, width)
  },
  vh(state) {
    return state.windowHeight / 100
  },
  vw(state) {
    return state.windowWidth / 100
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
