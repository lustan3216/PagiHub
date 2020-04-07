import JsonStorer from 'json-storer'
import Vue from 'vue'
const jsonStorer = new JsonStorer({
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

window.jsonStorer = jsonStorer

export default jsonStorer
