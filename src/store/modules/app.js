import { SET } from '../index'
import { arraySubtract, cloneJson, toArray } from '@/utils/tool'
import {
  isComponent,
  traversalAncestorAndSelf,
  traversalChildren
} from '@/utils/node'
import { quickFnMap } from '@/components/TemplateUtils/NodeQuickFunctions'
import { debounce } from 'throttle-debounce'
import { BREAK_POINTS } from '@/const'

const state = {
  artBoardResizing: false,
  breakpoint: 'lg',
  artBoardWidth: 1200,
  artBoardHeight: 768,
  scaleRatio: 1,
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

const actions = {
  setCopySelectedNodeId({ commit, state, rootState }, ids) {
    const { rootComponentSetIds, componentsMap } = rootState.component
    const copyComponentIds = ids
      ? toArray(ids)
      : state.selectedComponentIds.filter(
        id => !rootComponentSetIds.includes(id)
      )

    // the top component under rootComponentSet should not be copied
    const copyNodeArray = []
    copyComponentIds.forEach(id => {
      const node = componentsMap[id]
      traversalAncestorAndSelf(node, node => {
        // don't return, otherwise it will stop
        if (isComponent(node)) {
          copyNodeArray.push(node)
        }
      })
      traversalChildren(node, node => {
        // don't return, otherwise it will stop
        copyNodeArray.push(node)
      })
    })

    localStorage.setItem('copyComponentIds', JSON.stringify(copyComponentIds))
    localStorage.setItem('tmpComponentsArray', JSON.stringify(copyNodeArray))
    commit('SET', { copyComponentIds })
    commit('component/SET_NODES_TO_TMP_MAP', cloneJson(copyNodeArray), {
      root: true
    })
    return copyComponentIds
  },

  artBoardResizing: debounce(20, function(
    { state, commit, dispatch },
    boolean
  ) {
    const { clientWidth, clientHeight } = document.getElementById('art-board')
    const points = ['lg', 'md', 'sm', 'xs', 'xxs']
    const breakpoint = points.find(key => clientWidth >= BREAK_POINTS[key])

    commit('SET', {
      breakpoint,
      artBoardResizing: boolean,
      artBoardWidth: parseInt(clientWidth),
      artBoardHeight: parseInt(clientHeight)
    })

    if (!boolean) {
      dispatch('resizeNodeQuickFn')
    }
  }),

  resizeNodeQuickFn: debounce(210, function({ state }) {
    state.selectedComponentIds.forEach(id => {
      if (quickFnMap[id]) {
        quickFnMap[id].resize()
      }
    })
  })
}

const getters = {
  theOnlySelectedComponentId(state) {
    if (state.selectedComponentIds.length === 1) {
      return state.selectedComponentIds[0]
    }
  },
  selectedComponentNode(state, getters, rootState) {
    if (getters.theOnlySelectedComponentId) {
      return rootState.component.componentsMap[
        getters.theOnlySelectedComponentId
      ]
    }
  },
  selectedComponentNodes(state, getters, rootState) {
    return state.selectedComponentIds
      .map(id => rootState.component.componentsMap[id])
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
