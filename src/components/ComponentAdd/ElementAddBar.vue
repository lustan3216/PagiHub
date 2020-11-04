<template>
  <div class="align-center">
    <i
      v-shortkey="['esc']"
      v-if="creatingComponentTag"
      @shortkey="finish"
    />

    <el-tooltip
      effect="light"
      content="Image Asset"
      placement="bottom"
    >
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
      content="Text"
      placement="bottom"
    >
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
      content="Block"
      placement="bottom"
    >
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
          :key="option[1]"
          :command="option[0]"
        >
          <div class="align-center gray-font-2">
            <element-icon
              :icon="option[0]"
              class="m-r-10"
            />
            {{ capitalize(option[1]) }}
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
      imageSrc: null
    }
  },
  computed: {
    ...mapState('asset', ['images']),
    ...mapState('app', ['beingAddedComponentId', 'isAdding']),
    ...mapGetters('layout', ['currentBreakpoint']),
    ...mapGetters('app', ['selectedComponentNodes']),
    options() {
      return [
        ['rectangle', 'rectangle'],
        ['flex-button', 'button'],
        ['carousel', 'carousel'],
        ['video-player', 'video'],
        ['iframer', 'iframe']
      ]
    }
  },
  watch: {
    creatingComponentTag(value) {
      if (value) {
        this.selection.enable()
      }
      else {
        this.selection.disable()
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

      const element = evt.oe.path.find(node => node.dataset.addableId)
      const { x, y, width } = element.getBoundingClientRect()
      originX = x
      originY = y
      originW = width
      this.APP_SET({ beingAddedComponentId: element.dataset.addableId })
    })

    this.selection.on('stop', evt => {
      const grid = {
        [this.currentBreakpoint]: {
          x: startX - originX,
          y: startY - originY,
          w: Math.round(((evt.oe.clientX - startX) / originW) * 100),
          h: evt.oe.clientY - startY,
          unitW: '%',
          unitH: 'px'
        }
      }

      const options = {}
      if (this.creatingComponentTag === 'flex-image') {
        options.props = { src: this.imageSrc }
      }

      const node = getExample(this.creatingComponentTag, options, grid)
      vmAddNodeToParent(this.beingAddedComponentId, node)
      this.finish()
    })

    this.selection.disable()

    this.$bus.$on('art-board-scroll-top', this.updateScrollTop)
    this.$bus.$on('image-add', this.addImage)
  },
  beforeDestroy() {
    this.$bus.$off('art-board-scroll-top', this.updateScrollTop)
    this.$bus.$off('image-add', this.addImage)
  },
  methods: {
    ...mapActions('node', ['record']),
    ...mapActions('app', ['setBeingAddedComponentId']),
    ...mapMutations('app', { APP_SET: 'SET' }),
    ...mapMutations('asset', ['OPEN_ASSET']),
    capitalize,
    finish() {
      this.selection.disable()
      this.creatingComponentTag = null
      this.APP_SET({
        beingAddedComponentId: null,
        isAdding: false
      })
    },
    onClick(name) {
      this.creatingComponentTag = name
      this.APP_SET({ isAdding: name })
    },
    updateScrollTop(value) {
      this.scrollTop = value
    },
    addImage(src) {
      this.imageSrc = src
      this.creatingComponentTag = 'flex-image'
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

      this.record(records)
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
