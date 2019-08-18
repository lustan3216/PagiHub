import { isObject } from 'core-util-is'
import clone from 'clone'

class ContentVersion {
  currentIndex = 0

  constructor({ store = [], size = 35 } = {}) {
    this.size = size
    this.store = store
  }

  shot(data) {
    if (isObject(data)) {
      data = clone(data)
    }
    this.store.unshift(data)
    this.keepSizeLegal()
  }

  keepSizeLegal() {
    if (this.store.length > this.size) this.store.pop()
  }

  prev() {
    if (this.currentIndex < this.size && this.currentIndex < this.store.length) {
      ++this.currentIndex
      return this.store[this.currentIndex]
    }
  }

  next() {
    if (this.currentIndex > 0) {
      --this.currentIndex
      return this.store[this.currentIndex]
    }
  }
}

export default new ContentVersion()
