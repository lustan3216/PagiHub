<template>
  <div
    :style="innerStyles.default"
    class="h-100 border-box"
  >
    <controller-layer :id="currentNoe.id">
      <async-component
        :tag="currentNoe.tag"
        :id="currentNoe.id"
      />

      <portal-target
        v-if="isDraftMode"
        :name="`GridItemChild${currentNoe.id}`"
      />
    </controller-layer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import childrenMixin from './mixins/children'
import nodeMixin from './mixins/node'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import AsyncComponent from '../TemplateUtils/AsyncComponent'

export default {
  name: 'GridItemChild',
  components: {
    ControllerLayer,
    AsyncComponent
  },
  mixins: [childrenMixin, nodeMixin],
  data() {
    return {
      mounted: false
    }
  },
  computed: {
    ...mapState('app', ['isAnimating']),
    currentNoe() {
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
