<template>
  <el-button
    :icon="visible ? 'el-icon-view' : 'el-icon-circle-close'"
    type="text"
    @click.stop="click"
  />
</template>

<script>
import { vm } from '../../utils/vmMap'
import Vue from 'vue'
import { GRID_ITEM_CHILD } from '../../const'
const observable = Vue.observable({ ids: [] })

export default {
  name: 'Visible',
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    element() {
      if (this.isGridItemParent) {
        return this.parentVm.$el.parentNode
      } else {
        return this.selfVm.$el
      }
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
    visible() {
      return observable.ids.indexOf(this.id) === -1
    }
  },
  watch: {
    visible(canTouch) {
      this.element.classList[canTouch ? 'remove' : 'add']('invisible')
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
