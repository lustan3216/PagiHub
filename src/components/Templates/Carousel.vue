<template>
  <div
    v-observe-visibility="options"
    class="h-100"
  >
    <template v-if="inViewPort && this.innerProps.keyboard">
      <i
        v-shortkey="['arrowup']"
        v-if="canUp"
        @shortkey="carousel.prev()"
      />
      <i
        v-shortkey="['arrowdown']"
        v-if="canDown"
        @shortkey="carousel.next()"
      />
      <i
        v-shortkey="['arrowleft']"
        v-if="canLeft"
        @shortkey="carousel.prev()"
      />
      <i
        v-shortkey="['arrowright']"
        v-if="canRight"
        @shortkey="carousel.next()"
      />
    </template>

    <layers-interact
      v-if="arrow === 'never'"
      :id="layerInteractId"
      class="layers-interact"
    />
    <el-carousel
      ref="carousel"
      :style="innerStyles"
      v-bind="innerProps"
      :indicator-position="hasIndicator"
      :class="{ indicatorTop, indicatorLeft }"
      :arrow="arrow"
      draggable="false"
      class="wh-100"
    >
      <el-carousel-item
        v-for="child in gridGenerators"
        :key="child.id"
        class="asd"
      >
        <controller-layer
          :style="child.styles"
          :id="child.id"
        >
          <grid-generator
            :id="child.id"
            class="h-100"
          />
        </controller-layer>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import interactjs from 'interactjs'
import { ObserveVisibility } from 'vue-observe-visibility'
import childrenMixin from '@/components/Templates/mixins/children'
import nodeMixin from '@/components/Templates/mixins/node'
import GridGenerator from './GridGenerator'
import LayersInteract from './LayersInteract'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import { defaultSetting } from '../Setup/EditorSetting/SettingCarousel'
import { GRID_GENERATOR, LAYERS_INTERACT } from '@/const'

export default {
  defaultSetting,
  name: 'Carousel',
  components: {
    GridGenerator,
    ControllerLayer,
    LayersInteract
  },
  directives: {
    ObserveVisibility
  },
  mixins: [childrenMixin, nodeMixin],
  data() {
    return {
      canNotDrag: false,
      currentIndex: 0,
      inViewPort: false,
      options: {
        callback: isVisible => {
          this.inViewPort = isVisible
        }
      }
    }
  },
  computed: {
    gridGenerators() {
      return this.innerChildren.filter(x => x.tag === GRID_GENERATOR)
    },
    layerInteractId() {
      return this.innerChildren.filter(x => x.tag === LAYERS_INTERACT)[0].id
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
      return this.innerChildren.length - 2 === this.carousel.activeIndex
    },
    parentEl() {
      return (
        this.$parent &&
        this.$parent.$el &&
        this.$parent.$el.setAttribute &&
        this.$parent.$el
      )
    },
    carousel() {
      return this.$refs.carousel
    }
  },
  mounted() {
    let i = true
    const position = { x: 0, y: 0 }

    interactjs('.asd').draggable({
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
            } else if (i && position.x > 50) {
              i = false
              this.carousel.prev()
            }
          } else {
            if (i && position.y < -50) {
              i = false
              this.carousel.next()
            } else if (i && position.y > 50) {
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
  background-color: #bbbec1;
}
.layers-interact {
  z-index: 10;
  height: 0;
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
</style>
