<template>
  <div
    v-free-style="innerStyles"
    v-observe-visibility="options"
    class="h-100"
  >
    <template v-if="inViewPort && innerProps.keyboard">
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

    <template v-if="innerProps.arrow === 'custom'">
      <layers
        :id="firstLayerId"
        class="layers"
      />

      <portal :to="`GridItemChild${prevGridItemId}`">
        <el-tooltip
          effect="light"
          content="Replace Prev action in this button for nicer editing UX. It only shows in Draft mode."
          placement="top"
        >
          <el-button
            class="prev"
            icon="el-icon-thumb"
            circle
            @click="carousel.prev()"
          />
        </el-tooltip>
      </portal>

      <portal :to="`GridItemChild${nextGridItemId}`">
        <el-tooltip
          effect="light"
          content="Replace Next action in this button for nicer editing UX. It only shows in Draft mode."
          placement="top"
        >
          <el-button
            class="next"
            icon="el-icon-thumb"
            circle
            @click="carousel.next()"
          />
        </el-tooltip>
      </portal>
    </template>

    <el-carousel
      v-free-style="innerStyles"
      :ref="id"
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
        :class="`carousel-item-${id}`"
      >
        <layers
          :id="child.id"
          class="h-100"
        />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import interactjs from 'interactjs'
import { ObserveVisibility } from 'vue-observe-visibility'
import childrenMixin from '@/components/Templates/mixins/children'
import nodeMixin from '@/components/Templates/mixins/node'
import Layers from './Layers'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import { defaultSetting } from '../Setup/EditorSetting/SettingCarousel'
import { CHILDREN, LAYERS } from '@/const'
import { CarouselItem, Carousel } from 'element-ui'

export default {
  defaultSetting,
  name: 'Carousel',
  components: {
    ControllerLayer,
    Layers,
    ElCarouselItem: CarouselItem,
    ElCarousel: Carousel
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
      return this.innerChildren.filter(x => x.name === 'slider')
    },
    firstLayerId() {
      return this.innerChildren.filter(x => x.tag === LAYERS)[0].id
    },
    firstLayerChildren() {
      return this.componentsMap[this.firstLayerId][CHILDREN]
    },
    prevGridItemId() {
      return this.firstLayerChildren[0][CHILDREN][0].id
    },
    nextGridItemId() {
      return this.firstLayerChildren[0][CHILDREN][1].id
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
    carousel() {
      return this.$refs[this.id]
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
.layers {
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
.prev,
.next {
  right: -5px;
  top: -5px;
  position: absolute;
  padding: 5px;
}
</style>
