<template>
  <controller-layer v-if="hasAnyChild" :id="firstChild.id">
    <component :is="firstChild.tag" :id="firstChild.id" />
  </controller-layer>
  <div v-else-if="isDraftMode && !isExample" class="flex-center h-100 pointer">
    <example-add :id="id" @onAdd="resetIdsAndRecord($event)" />
    {{ node.id }}
    <el-button
      type="text"
      icon="el-icon-delete"
      size="small"
      @click.stop="() => remove(node.id)"
    />
  </div>
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
