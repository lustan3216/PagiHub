<template>
  <div
    :class="{ 'dash-border': dashBorder }"
    v-free-style="innerStyles"
    class="h-100"
  >
    <async-component
      v-if="firstChild"
      :id="firstChild.id"
    />

    <div
      v-else
      class="flex-center h-100"
    >
      <component-add
        v-if="!isExample && selected"
        :id="id"
        style="font-size: 16px;"
        class="p-10"
      />
    </div>
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
    ComponentAdd: () => import('../TemplateUtils/ComponentAdd'),
    ControllerLayer,
    NodeController,
    AsyncComponent
  },
  mixins: [childrenMixin, nodeMixin],
  data() {
    return {
      dashBorder: false
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    firstChild() {
      return this.innerChildren[0]
    },
    selected() {
      return this.selectedComponentIds.includes(this.id)
    }
  },
  watch: {
    isDraftMode: {
      handler(value) {
        this.dashBorder = value
      },
      immediate: true
    },
    'node.style.default': {
      handler(value = {}) {
        this.dashBorder =
          !value.border &&
          !value.borderTop &&
          !value.borderRight &&
          !value.borderBottom &&
          !value.borderLeft
      },
      immediate: true
    },
    'firstChild.style.default': {
      handler(value = {}) {
        this.dashBorder =
          !value.border &&
          !value.borderTop &&
          !value.borderRight &&
          !value.borderBottom &&
          !value.borderLeft
      },
      immediate: true
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
