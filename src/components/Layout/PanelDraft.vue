<template>
  <view-port>
    <layers
      v-if="rootNode"
      ref="panelDraft"
      :id="rootNode.id"
      class="panel-draft"
    />
  </view-port>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ViewPort from './ViewPort'
import Layers from '../Templates/Layers'
import { isMac } from '@/utils/device'
import Selection from '@simonwep/selection-js'

export default {
  name: 'PanelDraft',
  components: {
    ViewPort,
    Layers
  },
  computed: {
    ...mapGetters('draft', ['rootNode'])
  },
  beforeCreate() {
    this.$store.dispatch('project/getProjects')
  },
  mounted() {
    let selection

    this.$nextTick(() => {
      selection = Selection.create({
        class: 'selection',
        selectables: ['.control-layer'],
        boundaries: ['.panel-draft']
      })
        .on('start', ({ inst, selected, oe }) => {
          // Remove class if the user isn't pressing the control key or ⌘ key
          if (!oe.ctrlKey && !oe.metaKey) {
            // Unselect all elements
            for (const el of selected) {
              el.classList.remove('selected')
              inst.removeFromSelection(el)
            }

            // Clear previous selection
            inst.clearSelection()
          }
        })
        .on('move', ({ changed: { removed, added }}) => {
          for (const el of added) {
            el.classList.add('selected')
          }

          for (const el of removed) {
            el.classList.remove('selected')
          }
        })
        .on('stop', ({ inst, selected }) => {
          selected.forEach(({ id }) => {
            this.TOGGLE_SELECTED_COMPONENT_IN_IDS(+id)
          })

          inst.keepSelection()
        })
    })

    this.$bus.$on('selection-enable', value => {
      value ? selection.enable() : selection.disable()
    })
  },
  methods: {
    ...mapMutations('app', ['SET']),
    ...mapMutations('app', [
      'SET_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_IN_IDS'
    ]),
    isMac
  }
}
</script>

<style scoped lang="scss">
.panel-draft {
  overflow: auto;
  box-sizing: border-box;
  padding: 1px;
}
</style>
