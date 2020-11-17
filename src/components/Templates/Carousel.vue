<template>
  <grid-generator-item
    :id="id"
    data-image-droppable
  >
    <div
      v-observe-visibility="options"
      class="h-100 over-hidden"
    >
      <template v-if="inViewPort && innerProps.keyboard">
        <i
          v-shortkey="['arrowup']"
          v-if="canUp"
          @shortkey="carousel.prev"
        />
        <i
          v-shortkey="['arrowdown']"
          v-if="canDown"
          @shortkey="carousel.next"
        />
        <i
          v-shortkey="['arrowleft']"
          v-if="canLeft"
          @shortkey="carousel.prev"
        />
        <i
          v-shortkey="['arrowright']"
          v-if="canRight"
          @shortkey="carousel.next"
        />
      </template>

      <el-popover
        :disabled="disabledSliderButton || !isDraftMode"
        :value="editing"
        :visible-arrow="false"
        :placement="scrolling ? 'top' :'top-start'"
        effect="light"
        trigger="manual"
        popper-class="hide-popper"
      >
        <el-button-group>
          <el-button
            class="icon"
            @click="createSlider"
          >
            <i class="el-icon-plus" />
            Slider
          </el-button>

          <el-button
            class="icon"
            @click="deleteSlider"
          >
            <i class="el-icon-delete" />
            Slider
          </el-button>
        </el-button-group>

        <el-carousel
          slot="reference"
          ref="carousel"
          :id="id"
          :key="sliders.length"
          v-bind="innerProps"
          :indicator-position="hasIndicator"
          :class="{ indicatorTop, indicatorLeft }"
          :arrow="arrow"
          :autoplay="inViewPort ? innerProps.autoplay : false"
          draggable="false"
          class="wh-100"
          @change="checkSelectedComponent"
        >
          <el-carousel-item
            v-for="(child, index) in sliders"
            :key="child.id"
            :animation="animation"
            :class="{
              [`carousel-item-${id}`]: true
            }"
          >
            <slider
              v-if="index === currentIndex"
              :id="child.id"
              :style="{ cursor }"
              data-image-droppable
              controller
            />
          </el-carousel-item>
        </el-carousel>
      </el-popover>
    </div>
  </grid-generator-item>
</template>

<script>
import interactjs from 'interactjs'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { ObserveVisibility } from 'vue-observe-visibility'
import { STYLES } from '@/const'
import { Popover } from 'element-ui'
import propsMixin from '@/components/Templates/mixins/props'
import childrenMixin from '@/components/Templates/mixins/children'
import Slider from './Slider'
import GridGeneratorItem from './GridGeneratorItem'
import Carousel from '@/vendor/element-ui/Carousel'
import CarouselItem from '@/vendor/element-ui/CarouselItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingCarousel'
import { isCarousel, traversalChildren, isSlider } from '@/utils/node'
import { vmCreateEmptyItem, vmRemoveNode } from '@/utils/vmMap'
import { getValueByPath } from '@/utils/tool'
import { findIndexBy } from '@/utils/array'

export default {
  defaultSetting,
  name: 'Carousel',
  components: {
    Slider,
    GridGeneratorItem,
    ElCarouselItem: CarouselItem,
    ElCarousel: Carousel,
    ElPopover: Popover
  },
  directives: {
    ObserveVisibility
  },
  mixins: [childrenMixin, propsMixin],
  data() {
    return {
      canNotDrag: false,
      currentIndex: 0,
      inViewPort: false,
      animation: true,
      options: {
        callback: isVisible => {
          this.inViewPort = isVisible
        }
      }
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds', 'isAdding', 'editingPath']),
    ...mapState('layout', ['currentBreakpoint']),
    ...mapState('layout', ['scrolling']),
    disabledSliderButton() {
      let show = this.selected || this.editing

      traversalChildren(this.node, node => {
        if (isSlider(node) && node.parentId === this.id) {
          if (this.selectedComponentIds.includes(node.id) || this.editingPath.includes(node.id)) {
            show = true
          }
        }
        else if (isSlider(node) || isCarousel(node)) {
          if (this.editingPath.includes(node.id)) {
            show = false
            return false
          }
        }
      })

      return !show
    },
    selected() {
      return this.selectedComponentIds.includes(this.id)
    },
    editing() {
      return this.editingPath.includes(this.id)
    },
    cursor() {
      if (this.isAdding) {
        return 'crosshair'
      }
      if (this.innerProps.allowDrag) {
        return this.innerProps.direction === 'vertical'
          ? 'ns-resize'
          : 'ew-resize'
      }
      else {
        return 'default'
      }
    },
    sliders() {
      return this.innerChildren.filter(node => {
        const hidden = getValueByPath(node, [
          STYLES,
          this.currentBreakpoint,
          'hidden'
        ])
        return isSlider(node) && !hidden
      })
    },
    arrow() {
      return this.innerProps.arrow === 'custom'
        ? 'never'
        : this.innerProps.arrow
    },
    hasIndicator() {
      return this.innerProps.indicatorPosition === 'none' ? 'none' : ''
    },
    indicatorTop() {
      return this.innerProps.indicatorPosition === 'top'
    },
    indicatorLeft() {
      return this.innerProps.indicatorPosition === 'left'
    },
    isHorizontal() {
      return this.innerProps.direction === 'horizontal'
    },
    canUp() {
      return !this.isHorizontal && !this.isFirst
    },
    canDown() {
      return !this.isHorizontal && !this.isEnd
    },
    canRight() {
      return this.isHorizontal && !this.isEnd
    },
    canLeft() {
      return this.isHorizontal && !this.isFirst
    },
    isFirst() {
      return this.carousel.activeIndex === 0
    },
    isEnd() {
      return this.innerChildren.length - 1 === this.carousel.activeIndex
    },
    carousel() {
      return this.$refs.carousel
    }
  },
  mounted() {
    let i = true
    const position = { x: 0, y: 0 }

    interactjs(`.carousel-item-${this.id}`).draggable({
      ignoreFrom: '.vue-grid-item',
      listeners: {
        move: event => {
          if (!this.innerProps.allowDrag) {
            return
          }

          position.x += event.dx
          position.y += event.dy
          // event.target.style.transform = `translate(${position.x}px, ${position.y}px)`

          if (this.isHorizontal) {
            if (i && position.x < -50) {
              i = false
              this.carousel.next()
            }
            else if (i && position.x > 50) {
              i = false
              this.carousel.prev()
            }
          }
          else {
            if (i && position.y < -50) {
              i = false
              this.carousel.next()
            }
            else if (i && position.y > 50) {
              i = false
              this.carousel.prev()
            }
          }
        },
        end() {
          i = true
          position.x = 0
          position.y = 0
        }
      }
    })

    this.$bus.$on('carouselTransition', this.setAnimation)
  },
  beforeDestroy() {
    this.$bus.$on('carouselTransition', this.setAnimation)
  },
  methods: {
    ...mapMutations('app', [
      'CLEAN_SELECTED_COMPONENT_ID',
      'SET_SELECTED_COMPONENT_ID'
    ]),
    createSlider() {
      vmCreateEmptyItem(this.node.parentNode)
    },
    deleteSlider() {
      this.removeCurrentSlider()
    },
    checkSelectedComponent(index) {
      this.currentIndex = index
    },
    removeCurrentSlider() {
      const node = this.children[this.currentIndex]
      vmRemoveNode(node)
    },
    setAnimation(value) {
      this.animation = value
    },
    currentSliderNode() {
      return this.sliders[this.currentIndex]
    },
    setActiveIndex(childId) {
      this.currentIndex = findIndexBy(this.sliders, 'id', childId)
      this.carousel.setActiveItem(this.currentIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-carousel__container {
  height: 100%;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #e4e4e6;
}

::v-deep {
  .el-carousel__indicators {
    z-index: 30;
  }
  &.indicatorTop .el-carousel__indicators--horizontal {
    bottom: initial;
    top: 0;
  }

  &.indicatorLeft .el-carousel__indicators--vertical {
    right: initial;
    left: 0;
  }
}

.noTransition {
  transition-duration: 0s !important;
}

.customer-indicator {
  position: absolute;
  width: 100%;
  z-index: 10;
  pointer-events: none;
}

::v-deep.el-button-group {
  border-radius: 5px;
  background-color: white;
  margin-bottom: 0px;

  button {
    padding: 8px;
    color: $color-active;
    border: 1px solid $color-active;
  }

  i {
    color: $color-active;
  }
}

.el-button {
  padding: 4px 5px 2px;
}
</style>
