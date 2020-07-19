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

      <component-drop-zone
        v-else-if="isDraftMode && !isExample"
        :id="id"
        class="h-100"
      >
        <node-controller
          :id="currentNode.id"
          :exclude="['paste', 'delete']"
          class="flex-center wh-100"
        >
          <template v-slot="{ data: { mouseIn } }">
            <node-info
              v-if="!mouseIn"
              :id="currentNode.id"
            />
          </template>
        </node-controller>
      </component-drop-zone>

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
    ControllerLayer,
    NodeController,
    AsyncComponent,
    NodeInfo,
    ComponentDropZone
  },
  mixins: [childrenMixin, nodeMixin],
  computed: {
    ...mapState('app', ['isAnimating']),
    currentNode() {
      return this.firstChild || this.node
    },
    firstChild() {
      return this.innerChildren[0]
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep[data-invisible] + .vue-resizable-handle {
  display: none;
}
</style>
