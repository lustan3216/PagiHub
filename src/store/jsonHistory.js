import store from './index'
import JsonHistory from 'json-history'
import draftState from '@/utils/draftState'
import { cloneJsonWithoutChildren } from '@/utils/node'

const jsonHistory = new JsonHistory({
  steps: 200,
  treeFilter(tree) {
    return cloneJsonWithoutChildren(tree)
  },
  setter(tree, key, value) {
    store.commit('node/VUE_SET', { tree, key, value })
  },

  deleter(tree, key) {
    store.commit('node/VUE_DELETE', { tree, key })
  },

  callback: {
    onDeltasChanged() {
      const componentSetId = store.state.node.editingComponentSetId

      if (!componentSetId) {
        debugger
      }
      draftState.emitWhenRecord(componentSetId)
    },
    onUndid() {
      const componentSetId = store.state.node.editingComponentSetId
      draftState.emitWhenUndo(componentSetId)
    },
    onRedid() {
      const componentSetId = store.state.node.editingComponentSetId
      draftState.emitWhenRedo(componentSetId)
    }
  }
})

if (process.env.NODE_ENV !== 'production') {
  window.jsonHistory = jsonHistory
}

export default jsonHistory
