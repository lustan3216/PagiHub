export default class RequestQueue {
  queue = []
  running = false

  add(fn, params) {
    this.queue.unshift({ fn, params })

    if (!this.running) {
      this.runNext()
    }
  }

  async runNext() {
    if (!this.queue.length) {
      return
    }

    try {
      this.running = true
      const { fn, params } = this.queue.pop()
      await fn(params)
    }
    finally {
      this.running = false
      this.runNext()
    }
  }
}
