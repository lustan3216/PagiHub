import { SET } from '../index'
import { sortDescBreakpoint } from '@/utils/layout'
import { BREAK_POINTS_MAP } from '@/const'

const state = {
  gridResizing: false,
  scrolling: false,
  windowWidth: 0,
  windowHeight: 0,
  scaleRatio: 1,
  currentBreakpoint: 'lg'
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
