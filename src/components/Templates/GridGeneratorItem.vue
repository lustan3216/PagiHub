<template>
  <div
    v-free-style="innerStyles"
    :class="{
      'dash-border': isDraftMode && nodeNoBorder && firstChildNoBorder
    }"
    class="h-100"
    @scroll="onScroll"
  >
    <async-component
      v-if="firstChild"
      :id="firstChild.id"
    />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import childrenMixin from './mixins/children'
import nodeMixin from './mixins/node'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import ComponentController from '../TemplateUtils/ComponentController'
import AsyncComponent from '../TemplateUtils/AsyncComponent'

let timer

export default {
  name: 'GridGeneratorItem',
  components: {
    ControllerLayer,
    ComponentController,
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
    ...mapMutations('app', { APP_SET: 'SET' }),
    ...mapActions('app', ['artBoardResizing']),
    checkNoBorder(value) {
      return (
        !value.border &&
        !value.borderTop &&
        !value.borderRight &&
        !value.borderBottom &&
        !value.borderLeft
      )
    },
    onScroll() {
      this.APP_SET({ isArtBoardResizing: true })
      if (timer !== null) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        this.artBoardResizing(false)
      }, 80)
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
