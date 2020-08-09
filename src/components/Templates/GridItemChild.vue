<template>
  <!-- this controller-layer here only for grid-item -->
  <controller-layer :id="id">
    <async-component
      v-free-style="innerStyles"
      v-if="firstChild"
      :id="firstChild.id"
    />

    <div
      v-else-if="isDraftMode && !isExample && selected"
      class="flex-center wh-100"
    >
      <component-add
        :id="id"
        style="font-size: 16px; padding: 10px;"
      />
    </div>
  </controller-layer>
</template>

<script>
import { mapState } from 'vuex'
import childrenMixin from './mixins/children'
import nodeMixin from './mixins/node'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import NodeController from '../TemplateUtils/NodeController'
import AsyncComponent from '../TemplateUtils/AsyncComponent'

export default {
  name: 'GridItemChild',
  components: {
    ComponentAdd: () => import('../TemplateUtils/ComponentAdd'),
    ControllerLayer,
    NodeController,
    AsyncComponent
  },
  mixins: [childrenMixin, nodeMixin],
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    firstChild() {
      return this.innerChildren[0]
    },
    selected() {
      return this.selectedComponentIds.includes(this.id)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep[data-invisible] + .vue-resizable-handle {
  display: none;
}
</style>
