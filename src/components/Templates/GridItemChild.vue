<template>
  <controller-layer
    v-if="currentNode"
    :id="currentNode.id"
  >
    <div
      v-free-style="innerStyles"
      ref="styledElement"
      class="h-100 border-box"
    >
      <async-component
        v-if="firstChild"
        :tag="currentNode.tag"
        :id="currentNode.id"
      />

      <div
        v-else-if="isDraftMode && !isExample && selected"
        class="flex-center wh-100"
      >
        <component-add :id="id" size="large"/>
      </div>

      <portal-target
        v-if="isDraftMode"
        :name="`GridItemChild${currentNode.id}`"
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
import ComponentDropZone from '../TemplateUtils/ComponentDropZone'
import NodeInfo from '../TemplateUtils/NodeInfo'

export default {
  name: 'GridItemChild',
  components: {
    ComponentAdd: () => import('../TemplateUtils/ComponentAdd'),
    ControllerLayer,
    NodeController,
    AsyncComponent,
    NodeInfo,
    ComponentDropZone
  },
  mixins: [childrenMixin, nodeMixin],
  computed: {
    ...mapState('app', ['isAnimating', 'selectedComponentIds']),
    currentNode() {
      return this.firstChild || this.node
    },
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
