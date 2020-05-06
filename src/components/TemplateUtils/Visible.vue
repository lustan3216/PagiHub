<template>
  <transition name="fade">
    <el-button
      v-show="visible || !innerVisible"
      :icon="innerVisible ? 'el-icon-view' : 'el-icon-moon'"
      type="text"
      @click.stop="click"
    />
  </transition>
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
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    element() {
      return this.selfVm.$el
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
    innerVisible() {
      return observable.ids.indexOf(this.id) === -1
    }
  },
  watch: {
    innerVisible(visible) {
      console.log(this.id, this.visible, visible)
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
