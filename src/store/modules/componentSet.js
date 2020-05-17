import Vue from 'vue'
import { SET } from '../index'
import { cloneJson, nestedToLinerObject } from '@/utils/tool'
import { componentIds } from '@/utils/keyId'
import localforage from 'localforage'
import { CHILDREN } from '@/const'

const state = {
  componentSetMap: {},
  componentSets: []
}

const mutations = {
  SET
}

const actions = {
  async create(
    { dispatch, rootGetters, commit },
    { node, createBySelected, exampleComponentId }
  ) {
    let copyNodes = createBySelected
      ? rootGetters['app/selectedComponentTree']
      : rootGetters['example/basicMapById'][exampleComponentId]

    copyNodes = cloneJson(copyNodes)
    componentIds.resetNestedIds(copyNodes)
    copyNodes = nestedToLinerObject(copyNodes)
    await localforage.setItem(node.id, copyNodes)

    Vue.set(state.componentSetMap, node.id, {
      ...node,
      [CHILDREN]: [copyNodes]
    })

    state.componentSets.push(node)

    dispatch('component/setComponentSet', node.id, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
