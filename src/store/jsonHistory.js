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
    store.commit('component/VUE_SET', { tree, key, value })
  },

  deleter(tree, key) {
    store.commit('component/VUE_DELETE', { tree, key })
  },

  callback: {
    onDeltasChanged() {
      draftState.emitWhenRecord()
    },
    onUndid() {
      draftState.emitWhenUndo()
    },
    onRedid() {
      draftState.emitWhenRedo()
    }
  }
})

if (process.env.NODE_ENV !== 'production') {
  window.jsonHistory = jsonHistory
}

export default jsonHistory
