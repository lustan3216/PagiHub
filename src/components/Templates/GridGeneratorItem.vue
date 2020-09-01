<template>
  <div
    :class="{ 'grid-item-border': isDraftMode, 'h-100': !autoHeight }"
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
    autoHeight() {
      return this.firstChild && this.firstChild.autoHeight
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
