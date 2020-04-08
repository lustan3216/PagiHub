import Vue from 'vue'
import store from './index'
import JsonStorer from 'json-storer'

const map = {}

export default {
  get current() {
    const name = store.state.draft.draftComponentId

    if (!map[name]) {
      const jsonStorer = new JsonStorer({
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

      map[name] = jsonStorer
    }

    return map[name]
  }
}
