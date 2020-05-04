import Vue from 'vue'
import store from './index'
import JsonHistory from 'json-history'

const map = {}

export default {
  get current() {
    const name = store.state.draft.selectedComponentSetId

    if (!map[name]) {
      const jsonHistory = new JsonHistory({
        name: name,
        setter(tree, key, value) {
          if (tree[key] && tree.__ob__) {
            tree[key] = value
          } else {
            Vue.set(tree, key, value)
          }
        },

        deleter(tree, key) {
          Vue.delete(tree, key)
        }
      })

      map[name] = jsonHistory
    }

    return map[name]
  }
}
