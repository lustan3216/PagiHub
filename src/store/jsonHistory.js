import store from './index'
import JsonHistory from 'json-history'
import draftStateUploader from '@/utils/draftStateUploader'
import { objectFirstKey } from '@/utils/object'
import { getRootComponentSetId } from '@/utils/rootComponentSetId'
import { isComponentSet, isProject } from '@/utils/node'

const jsonHistory = new JsonHistory({
  steps: 200,

  treeFilter(tree) {
    const string = JSON.stringify(tree, function(key, value) {
      if (isProject(value) || isComponentSet(value)) {
        return {}
      }
      else if (value && value['children']) {
        const { children, ...newObject } = value
        return newObject
      }
      else {
        return value
      }
    })

    return JSON.parse(string)
  },
  setter(tree, key, value) {
    store.commit('node/VUE_SET', { tree, key, value })
  },
  deleter(tree, key) {
    store.commit('node/VUE_DELETE', { tree, key })
  },

  callback: {
    beforeUndo(deltaGroup) {
      rollbackSelectedComponentSet(deltaGroup)
    },
    beforeRedo(deltaGroup) {
      rollbackSelectedComponentSet(deltaGroup)
    },
    onDeltasChanged() {
      const componentSetId = store.state.node.editingComponentSetId
      draftStateUploader.emitWhenRecord(componentSetId)
    },
    onUndid() {
      const componentSetId = store.state.node.editingComponentSetId
      draftStateUploader.emitWhenUndo(componentSetId)
    },
    onRedid() {
      const componentSetId = store.state.node.editingComponentSetId
      draftStateUploader.emitWhenRedo(componentSetId)
    }
  }
})

if (process.env.NODE_ENV !== 'production') {
  window.jsonHistory = jsonHistory
}

export default jsonHistory

function rollbackSelectedComponentSet(deltaGroup) {
  if (!deltaGroup) {
    return false
  }

  const id = objectFirstKey(deltaGroup[0])
  const { editingProjectId } = store.state.node
  const rootComponentSetId = getRootComponentSetId(id)
  if (rootComponentSetId !== editingProjectId) {
    store.commit('node/SET_EDITING_COMPONENT_SET_ID', rootComponentSetId, {
      root: true
    })
  }

  return true
}
