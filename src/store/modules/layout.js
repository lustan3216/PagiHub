import { SET } from '../index'
import { debounce } from '@/utils/tool'
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

let timer
const actions = {
  checkIsGridResizing({ rootGetters, commit }) {
    if (!rootGetters['mode/isDraftMode']) {
      return
    }

    commit('SET', { gridResizing: true })
    if (timer !== null) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      commit('SET', { gridResizing: false })
    }, 80)
  },

  artBoardResizing({ state, getters, commit, dispatch }, boolean = false) {
    const { clientWidth, clientHeight } = document.getElementById('art-board')

    commit('SET', {
      gridResizing: boolean,
      artBoardWidth: parseInt(clientWidth),
      artBoardHeight: parseInt(clientHeight) - 2
    })

    if (!boolean) {
      dispatch('resizeNodeQuickFn')
    }
  },

  resizeNodeQuickFn({ rootState }) {
    rootState.app.selectedComponentIds.forEach(id => {
      if (quickFnMap[id]) {
        this._vm.$nextTick(() => {
          quickFnMap[id].resize()
        })
      }
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
