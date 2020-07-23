import { SET } from '../index'
import { ID } from '@/const'
import basic from '@/templateJson/basic'
import formItem from '@/templateJson/formItem'
import { appendIdNested } from '@/utils/nodeId'
import { traversal } from '@/utils/tool'

let inited = false

const state = {
  basicExamples: [],
  basicExamplesMap: {}
}

const mutations = {
  SET
}

const actions = {
  initExamples({ commit }) {
    if (inited) {
      return
    }

    inited = true
    const basicExamples = [...basic, ...formItem]
    appendIdNested(basicExamples)

    const basicExamplesMap = {}

    traversal(basicExamples, node => {
      const id = node[ID]
      basicExamplesMap[id] = node
    })

    commit('SET', {
      basicExamples,
      basicExamplesMap
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
