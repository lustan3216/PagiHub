<template>
  <controller-layer
    v-if="currentNode"
    :id="currentNode.id"
  >
    <div
      v-style="!isExample"
      ref="styledElement"
      class="h-100 border-box"
    >
      <async-component
        v-if="firstChild"
        :tag="currentNode.tag"
        :id="currentNode.id"
      />

      <node-controller
        v-else-if="isDraftMode"
        :id="currentNode.id"
        :exclude="['paste', 'delete']"
        class="self-center"
      />

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
import NodeInfo from '../TemplateUtils/NodeInfo'

export default {
  name: 'GridItemChild',
  components: {
    ControllerLayer,
    NodeController,
    AsyncComponent,
    NodeInfo
  },
  mixins: [childrenMixin, nodeMixin],
  data() {
    return {
      mounted: false
    }
  },
  computed: {
    ...mapState('app', ['isAnimating']),
    currentNode() {
      return this.firstChild || this.node
    },
    firstChild() {
      return this.innerChildren[0]
    }
  },
  mounted() {
    this.mounted = true
  }
}
</script>

<style scoped lang="scss">
::v-deep[data-invisible] + .vue-resizable-handle {
  display: none;
}
</style>
