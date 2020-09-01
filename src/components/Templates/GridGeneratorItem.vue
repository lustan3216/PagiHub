<template>
  <div
    :class="{ 'grid-item-border': isDraftMode, 'h-100': !fixContainer }"
    :style="innerStyles.default"
    @scroll="onScroll"
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
import ComponentController from '../TemplateUtils/ComponentController'
import AsyncComponent from '../TemplateUtils/AsyncComponent'
import { updateWrapperStyle } from '@/utils/quickFunction'
import { getValueByPath } from '@/utils/tool'
import { vmGet } from '@/utils/vmMap'

export default {
  name: 'GridGeneratorItem',
  components: {
    ControllerLayer,
    ComponentController,
    AsyncComponent
  },
  mixins: [childrenMixin, nodeMixin],
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    firstChild() {
      return this.innerChildren[0]
    },
    fixContainer() {
      return (
        getValueByPath(this, 'firstChild.style.default.overflow') ===
        'fixContainer'
      )
    }
  },
  watch: {
    'firstChild.style.default.overflow'(value) {
      const layout = vmGet(this.node.parentId, this.isExample)
      const layoutInner = layout.$children[0]
      const item = layoutInner.layout.find(node => node.id === this.id)

      item.autoHeight = value === 'fixContainer'
    }
  },
  methods: {
    onScroll: updateWrapperStyle
  }
}
</script>

<style scoped lang="scss">
::v-deep[data-invisible] + .vue-resizable-handle {
  display: none;
}
</style>
