import { SET } from '../index'
import { quickFnMap } from '@/components/TemplateUtils/ComponentQuickFunctions'
import { debounce } from 'throttle-debounce'
import { getBreakpoint } from '@/utils/layout'

const state = {
  breakpoint: 'lg',
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

  artBoardResizing({ state, commit, dispatch }, boolean = false) {
    const element = document.getElementById('art-board')
    const { clientWidth, clientHeight } = element

    commit('SET', {
      gridResizing: boolean,
      breakpoint: getBreakpoint(element),
      artBoardWidth: parseInt(clientWidth),
      artBoardHeight: parseInt(clientHeight) - 2
    })

    if (!boolean) {
      dispatch('resizeNodeQuickFn')
    }
  },

  resizeNodeQuickFn: debounce(310, function({ rootState }) {
    rootState.app.selectedComponentIds.forEach(id => {
      if (quickFnMap[id]) {
        quickFnMap[id].resize()
      }
    })
  })
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
