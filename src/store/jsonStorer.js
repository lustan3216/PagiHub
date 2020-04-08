import Vue from 'vue'
import JsonStorer from 'json-storer'

const map = {}

export default function(name) {
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
    return jsonStorer
  }

  return map[name]
}
