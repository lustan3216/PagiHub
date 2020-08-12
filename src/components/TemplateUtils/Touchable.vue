<template>
  <el-button
    v-if="visible || !innerTouchable"
    :icon="innerTouchable ? 'el-icon-unlock' : 'el-icon-lock'"
    type="text"
    @click.stop="click"
  />
</template>

<script>
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { GRID_ITEM } from '@/const'
const observable = Vue.observable({ ids: [] })

export default {
  name: 'Touchable',
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
      if (this.isGridItem) {
        return this.vm.$el.closest('.vue-grid-item')
      } else {
        return this.vm.$el
      }
    },
    vm() {
      return this.node.$vm
    },
    node() {
      return this.componentsMap[this.id]
    },
    isGridItem() {
      return this.vm.$options._componentTag === GRID_ITEM
    },
    innerTouchable() {
      return observable.ids.indexOf(this.id) === -1
    }
  },
  watch: {
    innerTouchable(canTouch) {
      if (canTouch) {
        delete this.element.dataset.lock

        if (this.isGridItem) {
          // GridGeneratorInner
          this.node.parentNode.$vm.$children[0].unlock(this.id)
        }
      } else {
        this.element.dataset.lock = ''

        if (this.isGridItem) {
          // GridGeneratorInner
          this.node.parentNode.$vm.$children[0].lock(this.id)
        }
      }
    }
  },
  methods: {
    ...mapMutations('component', ['VUE_SET', 'VUE_DELETE']),
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
