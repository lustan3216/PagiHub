<template>
  <div
    v-free-view="{ scaleCallback, targetSelector: '.viewer', moveIgnoreSelector: '.selected.art-board' }"
    class="wh-100"
    style="background-color:#f4f8fb;"
    @click="SET_EDITING_COMPONENT_SET_ID($event.target.dataset.id)"
  >
    <div class="viewer">
      <!--    <view-port-cover-->
      <!--      v-if="$refs.browser"-->
      <!--      :target="$refs.browser.$el"-->
      <!--      :class="{ interact: isDraftMode }"-->
      <!--    />-->

      <slot/>

      <portal to="ViewPort">
        <el-dropdown
          split-button
          size="small"
          @click="canvasWidthRollback"
          @command="canvasWidthChange"
        >
          <!--    need to reduce 4 pixel for border    -->
          {{ isCustom ? `${canvasWidth - 4} px` : current }}

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="option in options"
              :key="option"
              :command="option"
            >
              {{ option }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-button
          size="small"
          @click="scaleRollback"
        >
          {{ scalePercent }} %
        </el-button>
      </portal>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import DialogInteracted from '@/components/Components/DialogInteracted'
import ViewPortCover from './ViewPortCover'
import { directive } from '@/directive/freeView'

export default {
  name: 'ViewPort',
  components: {
    DialogInteracted,
    ViewPortCover
  },
  directives: {
    FreeView: directive
  },
  data() {
    const options = [
      'Custom',
      '1920px Computer',
      '1200px Computer',
      '996px  Computer',
      '768px  Tablet',
      '320px  Mobile'
    ]

    return {
      current: options[0],
      options,
      scaleRatio: 1,
      canvasWidth: 0
    }
  },
  computed: {
    ...mapState('mode', ['mode']),
    scalePercent() {
      return Math.ceil(+this.scaleRatio * 100)
    },
    isCustom() {
      return this.options[0] === this.current
    }
  },
  watch: {
    mode() {
      this.$nextTick(() => {
        this.canvasWidthRollback()
      })
    }
  },
  mounted() {
    // this.canvasWidthReset()
  },
  methods: {
    ...mapMutations('app', {
      appSET: 'SET'
    }),
    ...mapMutations('component', ['SET_EDITING_COMPONENT_SET_ID']),
    scaleRollback() {
      this.$el.style.webkitTransform = this.$el.style.transform = null
      this.scaleRatio = 1
      this.canvasWidthReset()
    },
    movableFunction(event) {
      return event.shiftKey
    },
    canvasWidthReset() {
      const browser = this.$refs.browser
      this.canvasWidth = browser.$el.clientWidth
      browser.reset()
    },
    canvasWidthChange(command) {
      // 4 pixel because border
      const pixel = parseInt(command) - 4

      this.option = command

      this.$refs.browser.$el.style.width = pixel ? `${pixel}px` : null
      this.canvasWidthReset()
    },
    canvasWidthRollback() {
      this.$refs.browser.$el.style.width = null
      this.canvasWidthReset()
    },
    scaleCallback(event, { scaleRatio }) {
      this.appSET({ scaleRatio })
      this.scaleRatio = scaleRatio
    }
  }
}
</script>
<style scoped lang="scss">
  .viewer {
    padding: 40px 35px;
    width: 4000px;
  }
</style>

