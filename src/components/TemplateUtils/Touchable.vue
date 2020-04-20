<template>
  <el-button
    :icon="touchable ? 'el-icon-thumb' : 'el-icon-circle-close'"
    type="text"
    @click.stop="click"
  />
</template>

<script>
import { vm } from '@/utils/vmMap'
import Vue from 'vue'
import { GRID_ITEM_CHILD } from '@/const'
const observable = Vue.observable({ ids: [] })

export default {
  name: 'Touchable',
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    element() {
      return this.selfVm.$el
    },
    selfVm() {
      return vm(this.id)
    },
    parentId() {
      return this.selfVm.node.parentId
    },
    parentVm() {
      return vm(this.parentId)
    },
    isGridItemParent() {
      return this.parentVm.$options._componentTag === GRID_ITEM_CHILD
    },
    touchable() {
      return observable.ids.indexOf(this.id) === -1
    }
  },
  watch: {
    touchable(canTouch) {
      if (canTouch) {
        delete this.element.dataset.noAction
      } else {
        this.element.dataset.noAction = ''
      }
    }
  },
  methods: {
    click() {
      const index = observable.ids.indexOf(this.id)
      if (index > -1) {
        observable.ids.splice(index, 1)
      } else {
        observable.ids.push(this.id)
      }
    }
  }
}
</script>
