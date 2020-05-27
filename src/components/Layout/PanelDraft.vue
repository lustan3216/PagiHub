<template>
  <view-port>
    <!--    <view-port-cover-->
    <!--      v-if="$refs.browser"-->
    <!--      :target="$refs.browser.$el"-->
    <!--      :class="{ interact: isDraftMode }"-->
    <!--    />-->

    <vue-grid-generator
      ref="gridGenerator"
      :layout="layout"
      :margin="[0, 0]"
      :vertical-compact="false"
      :col-num="4000"
      :row-height="1"
    >
      <vue-grid-item
        v-for="child in layout"
        :data-id="child.id"
        :key="child.id"
        :i="child.i"
        :x="child.x"
        :y="child.y"
        :w="child.w"
        :h="child.h"
        :is-draggable="editingComponentSetId !== child.id"
        class="item"
        @resized="itemResized(child, arguments[1], arguments[2])"
        @click.native.stop="itemClick(child.id)"
        @move="touching = true"
      >
        <art-board :id="child.id" />
      </vue-grid-item>
    </vue-grid-generator>
  </view-port>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import ViewPort from './ViewPort'
import ComponentSet from '../TemplateUtils/ComponentSet'
import { isMac } from '@/utils/device'
import Selection from '@simonwep/selection-js'
import ArtBoard from './ArtBoard'
import VueGridLayout from 'vue-grid-layout'

export default {
  name: 'PanelDraft',
  components: {
    ArtBoard,
    ViewPort,
    ComponentSet,
    VueGridGenerator: VueGridLayout.GridLayout,
    VueGridItem: VueGridLayout.GridItem
  },
  data() {
    return {
      layout: [],
      touching: false
    }
  },
  computed: {
    ...mapState('project', ['projectMap']),
    ...mapState('component', ['editingComponentSetId']),
    ...mapGetters('app', ['selectedComponentSetNodes'])
  },
  watch: {
    selectedComponentSetNodes: {
      handler(nodes) {
        let x = 0
        this.layout = nodes.map(node => {
          const object = {
            i: parseInt(node.id),
            id: node.id,
            h: node.h,
            w: node.w,
            x,
            y: 0
          }
          x = node.w + x + 50
          return object
        })
      },
      immediate: true
    }
  },
  beforeCreate() {
    this.$store.dispatch('project/getProjects')
  },
  mounted() {
    this.$nextTick(() => {
      Selection.create({
        class: 'selection',
        selectables: ['.control-layer'],
        boundaries: ['.panel-draft.selected']
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
    ...mapMutations('project', ['VUE_SET']),
    ...mapMutations('app', [
      'SET_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_IN_IDS',
      'CLEAN_SELECTED_COMPONENT_IDS'
    ]),
    ...mapMutations('component', ['SET_EDITING_COMPONENT_SET_ID', 'RECORD']),
    isMac,
    itemResized({ id }, h, w) {
      this.VUE_SET({
        tree: this.projectMap[id],
        key: 'h',
        value: h
      })

      this.VUE_SET({
        tree: this.projectMap[id],
        key: 'w',
        value: w
      })
    },
    itemClick(id) {
      if (!this.touching) {
        this.SET_EDITING_COMPONENT_SET_ID(id)
      }

      this.touching = false
    }
  }
}
</script>

<style scoped lang="scss">
  .item {
    box-sizing: border-box;
    border: 1px solid #f3f2f2;
    background-color: #fff;
  }

  ::v-deep.item > .vue-resizable-handle {
    bottom: -10px;
    right: -10px;
  }
</style>
