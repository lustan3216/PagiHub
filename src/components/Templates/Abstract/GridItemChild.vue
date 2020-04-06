<template>
  <controller-layer v-if="hasAnyChild" :id="firstChild.id">
    <component :is="firstChild.tag" :id="firstChild.id" />
  </controller-layer>
  <example-add
    v-else-if="isDraftMode && !isExample"
    :id="id"
    @onAdd="resetIdsAndRecord($event)"
  />
</template>

<script>
import importTemplates from '../../../mixins/importTemplates'
import childrenMixin from '../../../mixins/children'
import nodeMixin from '../../../mixins/node'
import ControllerLayer from './ControllerLayer'
import ExampleAdd from './ExampleAdd'

export default {
  name: 'GridItemChild',
  components: {
    ControllerLayer,
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
