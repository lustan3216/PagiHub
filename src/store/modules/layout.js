import { SET } from '../index'
import { debounce } from '@/utils/tool'
import { BREAK_POINT_KEYS } from '@/const'
import { quickFnMap } from '@/components/TemplateUtils/ComponentQuickFunctions'

const state = {
  gridResizing: false,
  artBoardWidth: 0,
  artBoardHeight: 0,
  scaleRatio: 1,
  breakpoint: 'lg',
  breakpointPixels: {
    xl: 1440,
    lg: 1200,
    md: 992,
    sm: 768,
    xs: 576,
    xxs: 320
  }
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
    const breakpoint =
      BREAK_POINT_KEYS.find(
        key => clientWidth >= getters.validBreakpointPixels[key]
      ) || 'xxs'

    commit('SET', {
      breakpoint,
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
  validBreakpointPixels(state) {
    const object = {}

    for (const key in state.breakpointPixels) {
      const value = state.breakpointPixels[key]
      if (value) {
        object[key] = value
      }
    }

    return object
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
