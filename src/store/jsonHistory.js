import store from './index'
import JsonHistory from 'json-history'
import RemoteState from '@/utils/remoteState'

const remoteState = new RemoteState()

const jsonHistory = new JsonHistory({
  steps: 200,
  setter(tree, key, value) {
    store.commit('component/VUE_SET', { tree, key, value })
  },

  deleter(tree, key) {
    store.commit('component/VUE_DELETE', { tree, key })
  },

  callback: {
    onDeltasChanged() {
      // remoteState.whenRecord()
    },
    onUndid() {
      // remoteState.whenUndo()
    },
    onRedid() {
      // remoteState.whenRedo()
    }
  }
})

if (process.env.NODE_ENV !== 'production') {
  window.jsonHistory = jsonHistory
}

export default jsonHistory
