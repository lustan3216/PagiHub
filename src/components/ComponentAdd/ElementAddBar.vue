<template>
  <div class="align-center">
    <el-tooltip
      effect="light"
      placement="bottom"
    >
      <div slot="content">
        Image Asset
        <i
          v-shortkey="['i']"
          class="gray-font-2 m-l-10"
          @shortkey="OPEN_ASSET"
        >
          I
        </i>
      </div>

      <el-button
        type="text"
        size="small"
        class="button"
        style="margin-right: 10px;"
        @click="OPEN_ASSET"
      >
        <b-icon-images
          style="font-size: 18px;"
          class="gray-font-2"
        />
      </el-button>
    </el-tooltip>

    <el-tooltip
      effect="light"
      placement="bottom"
    >
      <div slot="content">
        Text
        <i
          v-shortkey="['t']"
          class="gray-font-2 m-l-10"
          @shortkey="onClick('text-editor')"
        >
          T
        </i>
      </div>

      <el-button
        type="text"
        size="small"
        class="button"
        @click="onClick('text-editor')"
      >
        <element-icon
          icon="text-editor"
          style="font-size: 18px;"
        />
      </el-button>
    </el-tooltip>

    <el-tooltip
      effect="light"
      placement="bottom"
    >
      <div slot="content">
        Rectangle
        <i
          v-shortkey="['r']"
          class="gray-font-2 m-l-10"
          @shortkey="onClick('rectangle')"
        >
          R
        </i>
      </div>

      <el-button
        type="text"
        size="small"
        class="button"
        style="margin-right: 0;"
        @click="onClick('rectangle')"
      >
        <element-icon
          icon="rectangle"
          style="font-size: 18px;"
          class="gray-font-2"
        />
      </el-button>
    </el-tooltip>

    <el-dropdown
      size="small"
      style="margin-top: -2px; margin-right: 15px;"
      @command="onClick"
    >
      <span class="el-dropdown-link align-center">
        <i class="el-icon-arrow-down el-icon--right font-12" />
      </span>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="option in options"
          :key="option.tag"
          :command="option.tag"
        >
          <div class="gray-font-2 justify-between align-center">
            <span>
              <element-icon
                :icon="option.tag"
                class="m-r-10"
              />
              {{ option.label }}
            </span>

            <i
              v-shortkey="option.shortKey"
              v-if="option.shortKey"
              class="m-l-10"
              @shortkey="onClick(option.tag)"
            >
              {{ option.shortKeyString }}
            </i>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import Selection from '@simonwep/selection-js'
import ElementIcon from '@/components/Components/ElementIcon'
import { BIconImages } from 'bootstrap-vue'
import DialogImageTabs from './DialogImageTabs'
import { capitalize } from '@/utils/string'
import { getExample } from '@/templateJson/basic'
import { vmAddNodeToParent } from '@/utils/vmMap'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { toPrecision } from '@/utils/number'

export default {
  name: 'ElementAddBar',
  components: {
    ElementIcon,
    DialogImageTabs,
    BIconImages
  },
  inject: {
    isExample: { default: false }
  },
  data() {
    return {
      creatingComponentTag: null,
      selection: null,
      scrollTop: 0,
      imageSrc: null,
      nodeTree: null
    }
  },
  computed: {
    ...mapState('asset', ['images']),
    ...mapState('app', ['beingAddedComponentId', 'isAdding']),
    ...mapState('layout', ['currentBreakpoint']),
    ...mapGetters('app', ['selectedComponentNodes']),
    options() {
      return [
        {
          tag: 'rectangle',
          label: 'Rectangle',
          shortKey: ['r'],
          shortKeyString: 'R'
        },
        {
          tag: 'flex-button',
          label: 'Button',
          shortKey: ['b'],
          shortKeyString: 'B'
        },
        {
          tag: 'carousel',
          label: 'Carousel',
          shortKey: ['c'],
          shortKeyString: 'C'
        },
        {
          tag: 'video-player',
          label: 'Video'
        },
        {
          tag: 'iframer',
          label: 'Iframe'
        }
      ]
    },
    isTextEditor() {
      return this.creatingComponentTag === 'text-editor'
    }
  },
  watch: {
    isAdding(value) {
      if (value) {
        this.selection.enable()
      }
      else {
        this.cleanState()
      }
    }
  },
  mounted() {
    if (this.isExample) {
      return
    }

    let startX, startY, originX, originY, originW
    this.selection = new Selection({
      class: 'selection-area',
      startThreshold: 0,
      startareas: ['#art-board'],
      boundaries: ['#art-board']
    }).on('start', evt => {
      // A selection got initiated, you could now clear the previous selection or
      // keep it if in case of multi-selection.
      startX = evt.oe.clientX
      startY = evt.oe.clientY

      const element = evt.oe.path.find(node => node.dataset.addable === '')
      const { x, y, width } = element.getBoundingClientRect()
      originX = x
      originY = y
      originW = width
      this.APP_SET({ beingAddedComponentId: element.id })
    })

    this.selection.on('stop', evt => {
      const grid = {
        [this.currentBreakpoint]: {
          x: toPrecision((startX - originX) / originW * 100, 1),
          y: startY - originY,
          w: evt.oe.clientX - startX,
          h: this.isTextEditor ? 18 : evt.oe.clientY - startY,
          unitW: 'px',
          unitH: 'px',
          unitX: '%',
          unitY: 'px'
        }
      }

      const options = {}
      if (this.creatingComponentTag === 'flex-image') {
        options.props = { src: this.imageSrc }
      }

      let node
      if (this.nodeTree) {
        node = this.nodeTree
        node.grid = grid
      }
      else {
        node = getExample(this.creatingComponentTag, options, grid)
      }

      vmAddNodeToParent(this.beingAddedComponentId, node)
    })

    this.selection.disable()

    this.$bus.$on('artBoardScrollTop', this.updateScrollTop)
    this.$bus.$on('imageAdd', this.addImage)
    this.$bus.$on('nodeTreeAdd', this.addNodeTree)
  },
  beforeDestroy() {
    this.$bus.$off('artBoardScrollTop', this.updateScrollTop)
    this.$bus.$off('imageAdd', this.addImage)
    this.$bus.$off('nodeTreeAdd', this.addNodeTree)
  },
  methods: {
    ...mapActions('node', ['debounceRecord']),
    ...mapActions('app', ['setBeingAddedComponentId']),
    ...mapMutations('app', { APP_SET: 'SET' }),
    ...mapMutations('asset', ['OPEN_ASSET']),
    capitalize,
    cleanState() {
      this.selection.disable()
      this.creatingComponentTag = null
      this.imageSrc = null
      this.nodeTree = null
      this.APP_SET({
        beingAddedComponentId: null,
        isAdding: false
      })
    },
    onClick(name) {
      if (this.creatingComponentTag) {
        this.cleanState()
      }
      else {
        this.creatingComponentTag = name
        this.APP_SET({ isAdding: true })
      }
    },
    updateScrollTop(value) {
      this.scrollTop = value
    },
    addImage(src) {
      this.imageSrc = src
      this.creatingComponentTag = 'flex-image'
      this.APP_SET({ isAdding: true })
    },
    addNodeTree(nodeTree) {
      this.nodeTree = nodeTree
      this.APP_SET({ isAdding: true })
    },
    recordStyles(value) {
      const records = []

      this.selectedComponentNodes.forEach(node => {
        records.push({
          path: `${node.id}.props.src`,
          value
        })
      })

      this.debounceRecord(records)
    }
  }
}
</script>

<style scoped>
.button {
  font-size: 16px;
  padding: 7px;
  margin: 5px 10px;
}
</style>
