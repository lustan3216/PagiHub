import store from './index'
import JsonHistory from 'json-history'
import RemoteState from '@/utils/remoteState'
import { cloneJsonWithoutChildren } from '@/utils/node'

const remoteState = new RemoteState()

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
      remoteState.emitWhenRecord()
    },
    onUndid() {
      remoteState.emitWhenUndo()
    },
    onRedid() {
      remoteState.emitWhenRedo()
    }
  }
})

if (process.env.NODE_ENV !== 'production') {
  window.jsonHistory = jsonHistory
}

export default jsonHistory
