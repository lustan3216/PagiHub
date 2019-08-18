<template>
  <browser-window>
    <draggable
      :value="$observable.content"
      class="edit-area"
      group="people"
      @input="setContent">
      <template v-for="node in $observable.content">
        <render-node :dom="node" />
      </template>
    </draggable>
  </browser-window>
</template>

<script>
import { setContent } from '../observable/methods'
import BrowserWindow from './BrowserWindow'
import RenderNode from './RenderNode'
import importTemplatesMixin from '../mixins/importTemplates'

export default {
  name: 'App',
  components: {
    RenderNode,
    BrowserWindow
  },
  mixins: [importTemplatesMixin],
  methods: {
    setContent
  }
}
</script>

<style scoped lang="scss">
.edit-area {
  padding-top: 35px;
  @include calc-vh(min-height, '100vh - 135px');
}
</style>
