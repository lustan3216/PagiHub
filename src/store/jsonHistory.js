import store from './index'
import JsonHistory from 'json-history'
import RemoteState from '@/utils/remoteState'

const remoteState = new RemoteState()

const jsonHistory = new JsonHistory({
  steps: 200,
  // jsonDiffPatchOptions: {
  //   propertyFilter: function(name, context) {
  //     /*
  //      this optional function can be specified to ignore object properties (eg. volatile data)
  //      name: property name, present in either context.left or context.right objects
  //      context: the diff context (has context.left and context.right objects)
  //      */
  //     return name.slice(0, 1) !== '$';
  //   },
  // },
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
