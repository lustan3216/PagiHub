<template>
  <div
    v-free-style="innerStyles"
    :class="{
      'dash-border': isDraftMode && nodeNoBorder && firstChildNoBorder
    }"
    class="h-100"
  >
    <async-component
      v-if="firstChild"
      :id="firstChild.id"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import childrenMixin from './mixins/children'
import nodeMixin from './mixins/node'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import NodeController from '../TemplateUtils/NodeController'
import AsyncComponent from '../TemplateUtils/AsyncComponent'

export default {
  name: 'GridItem',
  components: {
    ControllerLayer,
    NodeController,
    AsyncComponent
  },
  mixins: [childrenMixin, nodeMixin],
  data() {
    return {
      nodeNoBorder: false,
      firstChildNoBorder: false
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    firstChild() {
      return this.innerChildren[0]
    }
  },
  watch: {
    'node.style.default': {
      handler(value = {}) {
        this.nodeNoBorder = this.checkNoBorder(value)
      },
      immediate: true
    },
    'firstChild.style.default': {
      handler(value = {}) {
        this.firstChildNoBorder = this.checkNoBorder(value)
      },
      immediate: true
    }
  },
  methods: {
    checkNoBorder(value) {
      return (
        !value.border &&
        !value.borderTop &&
        !value.borderRight &&
        !value.borderBottom &&
        !value.borderLeft
      )
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep[data-invisible] + .vue-resizable-handle {
  display: none;
}
.dash-border {
  border: 1px dashed #dedede;
  margin: -1px;
}
</style>
