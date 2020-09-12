import { SET } from '../index'
import { ID } from '@/const'
import basic from '@/templateJson/basic'
import { appendIds } from '@/utils/nodeId'
import { traversalSelfAndChildren } from '@/utils/node'

let inited = false

const state = {
  basicExamples: [],
  exampleNodesMap: {}
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
    const basicExamples = basic
    // const basicExamples = [...basic, ...formItem]
    appendIds(basicExamples)

    const exampleNodesMap = {}

    traversalSelfAndChildren(basicExamples, node => {
      const id = node[ID]
      exampleNodesMap[id] = node
    })

    commit('SET', {
      basicExamples,
      exampleNodesMap
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
