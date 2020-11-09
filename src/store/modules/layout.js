import { SET } from '../index'
import { findBreakpoint, sortDescBreakpoint } from '@/utils/layout'
import { BREAK_POINTS_MAP } from '@/const'

const state = {
  gridResizing: false,
  windowX: 0,
  windowY: 0,
  windowWidth: 0,
  windowHeight: 0,
  backgroundHeight: 0,
  scaleRatio: 1
}

const mutations = {
  SET
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
  getters
}
