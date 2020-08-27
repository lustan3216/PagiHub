import { patchComponentSetChildren } from '@/api/node'
import jsonHistory from '@/store/jsonHistory'
import store from '@/store'
import { cloneJson } from '@/utils/tool'

const DEBOUNCE_TIME = 1500

class DraftState {
  remoteRecordTime = +new Date()
  timerId = null
  requesting = false
  promise = null

  emitWhenRecord() {
    this.cleanTime()

    if (!this.requesting) {
      this.startTime()
    }
  }

  emitWhenRedo() {
    this.cleanTime()
    if (!this.requesting) {
      this.startTime()
    }
  }

  emitWhenUndo() {
    this.cleanTime()
    if (!this.requesting) {
      this.startTime()
    }
  }

  cleanTime() {
    clearInterval(this.timerId)
    this.timerId = null
  }

  startTime() {
    this.timerId = setTimeout(this.requestPutDeltas.bind(this), DEBOUNCE_TIME)
  }

  async publish(tree) {
    try {
      await this.promise
      this.cleanTime()
      this.requesting = true

      const requestDeltaTime = +new Date()

      await patchComponentSetChildren({ tree })
      this.remoteRecordTime = requestDeltaTime
    }
    catch (e) {
      throw e
    }
    finally {
      this.promise = null
      this.requesting = false
    }
  }

  get currentDeltaTime() {
    const { currentIndex, deltas } = jsonHistory
    return deltas[currentIndex].createdAt
  }

  getRedoDeltas() {
    //        2.5 = remoteRecordTime
    // [5,4,3,    2,1]
    // [5,4,3,2,1].slice(0,3) = [5,4,3]
    const index = jsonHistory.deltas.findIndex(
      delta => delta.createdAt > this.remoteRecordTime
    )
    return jsonHistory.deltas.slice(jsonHistory.currentIndex, index + 1)
  }

  getUndoDeltas() {
    //      3.5 = remoteRecordTime
    // [5,4,   3,2,1]
    // [5,4,3,2,1].slice(0,3) = [5,4,3]
    const index = jsonHistory.deltas.findIndex(
      delta => delta.createdAt < this.remoteRecordTime
    )
    return jsonHistory.deltas.slice(jsonHistory.currentIndex, index + 1)
  }

  async requestPutDeltas() {
    try {
      if (this.remoteRecordTime === this.currentDeltaTime) {
        return
      }

      this.requesting = true
      let deltas
      let action

      if (this.currentDeltaTime > this.remoteRecordTime) {
        deltas = this.getRedoDeltas()
        action = 'redo'
      }
      else if (this.currentDeltaTime < this.remoteRecordTime) {
        deltas = this.getUndoDeltas()
        action = 'undo'
      }

      const requestDeltaTime = this.currentDeltaTime
      this.promise = await patchComponentSetChildren({ deltas, action })
      this.remoteRecordTime = requestDeltaTime
      this.requestPutDeltas() // to check any new record is created when requesting
    }
    catch (e) {
      // should save in localstroage for tmp
      throw e
    }
    finally {
      this.promise = null
      this.requesting = false
    }
  }

  transformDeltas(index, index2) {
    // const deltas = []
    // jsonHistory.deltas.slice(index, index2).forEach(group => {
    //   const newGroup = []
    //   group.forEach(delta => {
    //     newGroup.push({
    //       delta,
    //       rootComponentSetId: getRootComponentSetId(objectFirstKey(delta))
    //     })
    //   })
    //   deltas.push(newGroup)
    // })
    return jsonHistory.deltas.slice(index, index2)
  }
}

export default new DraftState()
