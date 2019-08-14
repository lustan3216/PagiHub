<template>
  <el-main>
    <draggable
      v-model="$observable.content"
      class="edit-area"
      group="people">
      <template v-for="node in $observable.content">
        <render-node :dom="node" />
      </template>
    </draggable>
  </el-main>
</template>

<script>
import RenderNode from './RenderNode'
import importTemplatesMixin from '../mixins/importTemplates'

export default {
  name: 'App',
  components: {
    RenderNode
  },
  mixins: [importTemplatesMixin],
  computed: {}
}
</script>

<style scoped lang="scss">
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: inherit;
}
.edit-area {
  height: 80vh;
}
</style>
