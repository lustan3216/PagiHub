<template>
  <el-button
    :icon="visible ? 'el-icon-view' : 'el-icon-moon'"
    type="text"
    @click.stop="click"
  />
</template>

<script>
import Vue from 'vue'
import { GRID_ITEM_CHILD } from '@/const'
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
      return this.selfVm.$el
      // if (this.isGridItemParent) {
      //   return this.parentVm.$el.parentNode
      // } else {
      //
      // }
    },
    selfVm() {
      return this.vmMap[this.id]
    },
    parentId() {
      return this.selfVm.node.parentId
    },
    parentVm() {
      return this.vmMap[this.parentId]
    },
    isGridItemParent() {
      return this.parentVm.$options._componentTag === GRID_ITEM_CHILD
    },
    visible() {
      return observable.ids.indexOf(this.id) === -1
    }
  },
  watch: {
    visible(visible) {
      if (visible) {
        delete this.element.dataset.invisible
      } else {
        this.element.dataset.invisible = ''
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
