<template>
  <el-button
    v-if="visible || !innerVisible"
    :icon="innerVisible ? 'el-icon-sunny' : 'el-icon-moon'"
    type="text"
    @click.stop="click"
  />
  <!--  <i-->
  <!--    v-else-if="!visible && innerVisible"-->
  <!--    class="dot"-->
  <!--  />-->
</template>

<script>
import Vue from 'vue'
import { GRID_ITEM_CHILD } from '@/const'
const observable = Vue.observable({ ids: [] })

export default {
  name: 'Visible',
  props: {
    id: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    element() {
      return this.selfVm.$el
    },
    selfVm() {
      return this.vmMap[this.id]
    },
    innerVisible() {
      return observable.ids.indexOf(this.id) === -1
    }
  },
  watch: {
    innerVisible(visible) {
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

<!--<style scoped>-->
<!--.dot {-->
<!--  width: 2px;-->
<!--  height: 2px;-->
<!--  background-color: #b1b1b1;-->
<!--  border-radius: 50%;-->
<!--  margin-top: 15px;-->
<!--  margin-bottom: 3px;-->
<!--}-->
<!--</style>-->
