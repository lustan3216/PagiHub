export default class {
  map = {}

  create(key) {
    const max = this.max(key)
    const id = max + 1
    this.add(key, id)

    return id.toString()
  }

  add(key, id) {
    this.checkSetExist(key)
    this.map[key].add(parseInt(id))
  }

  max(key) {
    this.checkSetExist(key)
    return Math.max(...this.map[key])
  }

  remove(key, id) {
    this.checkSetExist(key)
    this.map[key].delete(parseInt(id))
  }

  checkSetExist(key) {
    if (!this.map[key]) {
      this.map[key] = new Set([0]) // to prevent zero as ID
    }
  }
}
