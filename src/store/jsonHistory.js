import store from './index'
import JsonHistory from 'json-history'

const jsonHistory = new JsonHistory({
  name: name,
  setter(tree, key, value) {
    store.commit('component/VUE_SET', { tree, key, value })
  },

  deleter(tree, key) {
    store.commit('component/VUE_DELETE', { tree, key })
  }
})

// export function cleanJsonHistoryByIds(removeId) {
//   const { deltas, currentIndex } = jsonHistory
//
//   const leftDeltas = []
//   let selfExist
//
//   for (let i = 0; i < deltas.length; i++) {
//     const deltaGroup = jsonHistory.deltas[i]
//
//     const id = objectHasAnyKey(deltaGroup[0])
//     const { componentSetId } = nodeIds.departId(id)
//
//     if (currentIndex === i) {
//       selfExist = componentSetId === removeId
//     }
//
//     if (componentSetId !== removeId) {
//       leftDeltas.push(deltaGroup)
//     }
//   }
//
//   jsonHistory.currentIndex = selfExist
//     ? leftDeltas.length
//     : leftDeltas.length + 1
//   jsonHistory.deltas = leftDeltas
// }

if (process.env.NODE_ENV !== 'production') {
  window.jsonHistory = jsonHistory
}

export default jsonHistory
