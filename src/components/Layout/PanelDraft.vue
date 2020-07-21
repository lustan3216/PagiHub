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
import { mapState, mapMutations, mapActions } from 'vuex'
import ViewPort from './ViewPort'
import ComponentSet from '../TemplateUtils/ComponentSet'
import { isMac } from '@/utils/device'
import Selection from '@simonwep/selection-js'
import ArtBoard from './ArtBoard'
import VueGridLayout from 'vue-grid-layout'
import { debounce } from 'throttle-debounce'

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
    ...mapState('component', ['editingComponentSetId']),
    ...mapState('app', ['selectedComponentSetIds'])
  },
  watch: {
    selectedComponentSetIds: {
      handler(ids) {
        let x = 0
        this.layout = ids.map(id => {
          const node = this.componentsMap[id]
          const object = {
            i: parseInt(node.id.replace(/\D/g, '')),
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
  created() {
    if (this.$route.params.projectId) {
      this.getProject(this.$route.params.projectId).then(project => {
        if (!project) {
          this.$router.push('/projects')
        }
      })
    }

    this.initExamples()
  },
  mounted() {
    this.$nextTick(() => {
      Selection.create({
        class: 'selection',
        selectables: ['.control-layer'],
        boundaries: ['.art-board.selected']
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
    ...mapActions('component', ['getProject']),
    ...mapActions('example', ['initExamples']),
    ...mapMutations('component', ['VUE_SET']),
    ...mapMutations('app', [
      'SET_SELECTED_COMPONENT_ID',
      'TOGGLE_SELECTED_COMPONENT_IN_IDS'
    ]),
    ...mapMutations('component', ['SET_EDITING_COMPONENT_SET_ID', 'RECORD']),
    isMac,
    itemResized: debounce(300, function({ id }, h, w) {
      this.VUE_SET({
        tree: this.componentsMap[id],
        key: 'h',
        value: h
      })

      this.VUE_SET({
        tree: this.componentsMap[id],
        key: 'w',
        value: w
      })
    }),
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
