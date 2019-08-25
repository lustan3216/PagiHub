<template>
  <draggable
    :value="children"
    handle=".wrapper-handler"
    class="edit-area"
    group="editableArea"
    @input="setContent">
    {{ $log('editarea') }}
    <render-node
      v-for="node in children"
      :dom="node" />
  </draggable>
</template>

<script>
import { snapShot } from '../observable/methods'
import RenderNode from './RenderNode'
import importTemplatesMixin from '../mixins/importTemplates'

export default {
  name: 'EditArea',
  components: {
    RenderNode
  },
  mixins: [importTemplatesMixin],
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  computed: {
    children() {
      if (this.node === this.$observable) {
        return this.$observable.content
      } else {
        return this.node.children
      }
    }
  },
  methods: {
    setContent(value) {
      console.log(1)
      if (this.node === this.$observable) {
        console.log(321)
        this.$observable.content = value
      } else {
        console.log(321321)
        this.node.children = value
      }
      snapShot()
    }
  }
}
</script>

<style scoped lang="scss">
.edit-area {
  height: 100%;
  border: 1px dashed gray;
}
</style>
