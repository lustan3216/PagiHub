export default class {
  map = {}

  create(key) {
    const max = this._max(key)
    const id = max + 1
    this.add(key, id)

    return id.toString()
  }

  _add(key, id) {
    this._checkSetExist(key)
    this.map[key].add(parseInt(id))
  }

  _max(key) {
    this.v(key)
    return Math.max(...this.map[key])
  }

  _remove(key, id) {
    this._checkSetExist(key)
    this.map[key].delete(parseInt(id))
  }

  _checkSetExist(key) {
    if (!this.map[key]) {
      this.map[key] = new Set([0]) // to prevent zero as ID
    }
  }
}
