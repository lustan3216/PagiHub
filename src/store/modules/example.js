import { SET } from '../index'
import { ID } from '@/const'
import basic from '@/templateJson/basic'
import { appendIdNested } from '@/utils/nodeId'
import { traversalSelfAndChildren } from '@/utils/node'

let inited = false

const state = {
  basicExamples: [],
  exampleComponentsMap: {}
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
    appendIdNested(basicExamples)

    const exampleComponentsMap = {}

    traversalSelfAndChildren(basicExamples, node => {
      const id = node[ID]
      exampleComponentsMap[id] = node
    })

    commit('SET', {
      basicExamples,
      exampleComponentsMap
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
