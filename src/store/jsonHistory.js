import Vue from 'vue'
import store from './index'
import JsonHistory from 'json-history'
import { objectHasAnyKey } from '@/utils/tool'
import { nodeIds } from '@/utils/nodeId'

const map = {}
const jsonHistory = new JsonHistory({
  name: name,
  setter(tree, key, value) {
    store.commit('component/VUE_SET', { tree, key, value })
  },

  deleter(tree, key) {
    store.commit('component/VUE_SET', { tree, key })
  }
})

// const jsonHistory = {
//   get current() {
//     const name = store.state.component.editingComponentSetId
//
//     if (!map[name]) {
//       const jsonHistory = new JsonHistory({
//         name: name,
//         setter(tree, key, value) {
//           if (tree[key] && tree.__ob__) {
//             tree[key] = value
//           } else {
//             Vue.set(tree, key, value)
//           }
//         },
//
//         deleter(tree, key) {
//           Vue.delete(tree, key)
//         },
//
//         callback: {
//           onRedo: rollbackSelectedComponentSet,
//           onUndo: rollbackSelectedComponentSet
//         }
//       })
//
//       map[name] = jsonHistory
//     }
//
//     return map[name]
//   }
// }

export function resetJsonHistory(removeId) {
  const { deltas, currentIndex } = jsonHistory

  const leftDeltas = []
  let selfExist

  for (let i = 0; i < deltas.length; i++) {
    const deltaGroup = jsonHistory.deltas[i]

    const id = objectHasAnyKey(deltaGroup[0])
    const { componentSetId } = nodeIds.departId(id)

    if (currentIndex === i) {
      selfExist = componentSetId === removeId
    }

    if (componentSetId !== removeId) {
      leftDeltas.push(deltaGroup)
    }
  }

  jsonHistory.currentIndex = selfExist
    ? leftDeltas.length
    : leftDeltas.length + 1
  jsonHistory.deltas = leftDeltas
}

if (process.env.NODE_ENV !== 'production') {
  window.jsonHistory = jsonHistory
}

export default jsonHistory
