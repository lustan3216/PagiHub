<template>
<!--  dash-border 不要跟 async-component 合併，不然async-component hidden 時 border會不見-->
  <div v-if="firstChild" class="h-100" :class="{ 'dash-border': dashBorder }">
    <div class="h-100" v-free-style="innerStyles">
      <async-component :id="firstChild.id" />
    </div>
  </div>

  <div
    v-else
    v-free-style="innerStyles"
    class="h-100"
  >
    <div :class="{ 'dash-border': dashBorder }" class="flex-center h-100">
      <component-add
        v-if="!isExample && selected"
        :id="id"
        style="font-size: 16px; padding: 10px;"
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
        this.dashBorder = !value.border && !value.borderTop && !value.borderRight && !value.borderBottom && !value.borderLeft
      },
      immediate: true
    },
    'firstChild.style.default': {
      handler(value = {}) {
        this.dashBorder = !value.border && !value.borderTop && !value.borderRight && !value.borderBottom && !value.borderLeft
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
