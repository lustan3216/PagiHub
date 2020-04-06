<template>
  <middle-layer v-if="hasAnyChild" :id="firstChild.id">
    <component :is="firstChild.tag" :id="firstChild.id" />
  </middle-layer>
  <example-add
    v-else-if="isDraftMode && !isExample"
    :id="id"
    @onAdd="create($event)"
  />
</template>

<script>
import importTemplates from '../../../mixins/importTemplates'
import childrenMixin from '../../../mixins/children'
import nodeMixin from '../../../mixins/node'
import MiddleLayer from './MiddleLayer'
import ExampleAdd from './ExampleAdd'

export default {
  name: 'GridItemChild',
  components: {
    MiddleLayer,
    ExampleAdd
  },
  mixins: [importTemplates, childrenMixin, nodeMixin]
}
</script>

<style scoped lang="scss">
.drag-handler-icon {
  position: absolute;
  width: 12px;
  top: 5px;
  left: 5px;
}
.edit-area {
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}
.fade-out {
  transition: opacity 0.6s ease;
  opacity: 0.1;
}
</style>
