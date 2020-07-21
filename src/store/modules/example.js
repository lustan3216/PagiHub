import { SET } from '../index'
import { ID } from '@/const'
import basic from '@/templateJson/basic'
import formItem from '@/templateJson/formItem'
import { appendIdNested } from '@/utils/nodeId'
import { traversal } from '@/utils/tool'

const state = {
  basicExamples: [],
  basicExamplesMap: {}
}

const mutations = {
  SET
}

const actions = {
  initExamples({ commit }) {
    const basicExamples = basic
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
