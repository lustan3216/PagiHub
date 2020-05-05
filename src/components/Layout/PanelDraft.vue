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
    this.$nextTick(() => {
      Selection.create({
        class: 'selection',
        selectables: ['.control-layer'],
        boundaries: ['.panel-draft']
      })
        .on('beforestart', ({ oe }) => {
          return (
            oe.path[0].classList.contains('panel-draft') ||
            oe.path[1].classList.contains('panel-draft')
          )
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
          inst.enable()
          inst.keepSelection()
        })
    })
  },
  methods: {
    ...mapMutations('app', ['SET']),
    ...mapMutations('app', [
      'SET_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_IN_IDS',
      'CLEAN_SELECTED_COMPONENT_IDS'
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
