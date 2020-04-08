<template>
  <el-button
    :icon="touchable ? 'el-icon-thumb' : 'el-icon-circle-close'"
    type="text"

    @click.stop="click"
  />
</template>

<script>
import { vm as _vm } from '../../utils/vmMap'
import Vue from 'vue'
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
      const vm = _vm(this.id)
      return vm.$el.closest('.vue-grid-item') || vm.$el
    },
    touchable() {
      return observable.ids.indexOf(this.id) === -1
    }
  },
  watch: {
    touchable(canTouch) {
      this.element.classList[canTouch ? 'remove' : 'add']('no-action')
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
