import { SET } from '../index'
import { debounce } from '@/utils/tool'
import { quickFnMap } from '@/components/TemplateUtils/ComponentQuickFunctions'
import { arrayDescSort } from '@/utils/array'
import { normalizeBreakpoint } from '@/utils/layout'
import { DEFAULT_BREAKPOINTS } from '@/const'

const state = {
  gridResizing: false,
  artBoardWidth: 0,
  artBoardHeight: 0,
  scaleRatio: 1,
  breakpoints: DEFAULT_BREAKPOINTS
}

const mutations = {
  SET
}

let timer
const actions = {
  initBreakpoints({ rootState, commit }, id) {
    const { editingComponentSetId, nodesMap } = rootState.node

    if (id || editingComponentSetId) {
      const { breakpoints } = nodesMap[id || editingComponentSetId]
      commit('SET', {
        breakpoints: normalizeBreakpoint(breakpoints)
      })
    }
  },
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

  resizeNodeQuickFn: debounce(function({ rootState }) {
    rootState.app.selectedComponentIds.forEach(id => {
      if (quickFnMap[id]) {
        quickFnMap[id].resize()
      }
    })
  }, 320)
}

const getters = {
  currentBreakpoint({ breakpoints, artBoardWidth: width }) {
    let currentPoint = 0
    arrayDescSort(breakpoints).find((point, index) => {
      if (
        point === width ||
        (width < breakpoints[index - 1] && width > point)
      ) {
        currentPoint = point
        return true
      }
    })

    return currentPoint
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
