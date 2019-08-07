<template>
  <el-main>
    <draggable
      v-model="dom"
      group="people">
      <render-nodes :dom="dom" />
    </draggable>
  </el-main>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import RenderNodes from './RenderNodes'

export default {
  name: 'App',
  components: {
    RenderNodes
  },
  computed: {
    ...mapState('content', ['vNodes']),
    dom: {
      get() {
        return this.vNodes
      },
      set(value) {
        this.SET_CONTENT(value)
      }
    }
  },
  methods: {
    ...mapMutations('content', ['SET_CONTENT'])
  }
}
</script>

<style scoped lang="scss">
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: inherit;
}
</style>
