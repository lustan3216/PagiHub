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
      <grid
        :id="customerIndicator.id"
        class="customer-indicator"
      />

      <portal :to="`QuickFunctions${prevGridItemId}`">
        <el-tooltip
          effect="light"
          content="Replace Prev action in this button for nicer editing UX. It only shows in Draft mode."
          placement="top"
        >
          <el-button
            icon="el-icon-thumb"
            @click="carousel.prev()"
          />
        </el-tooltip>
      </portal>

      <portal :to="`QuickFunctions${nextGridItemId}`">
        <el-tooltip
          effect="light"
          content="Replace Next action in this button for nicer editing UX. It only shows in Draft mode."
          placement="top"
        >
          <el-button
            icon="el-icon-thumb"
            @click="carousel.next()"
          />
        </el-tooltip>
      </portal>
    </template>

    <el-carousel
      :ref="id"
      v-bind="innerProps"
      :indicator-position="hasIndicator"
      :class="{ indicatorTop, indicatorLeft }"
      :arrow="arrow"
      draggable="false"
      class="wh-100"
      @change="checkSelectedComponent"
    >
      <el-carousel-item
        v-for="child in gridGenerators"
        :key="child.id"
        :class="`carousel-item-${id}`"
      >
        <async-component :id="child.id" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import interactjs from 'interactjs'
import { mapState, mapMutations } from 'vuex'
import { ObserveVisibility } from 'vue-observe-visibility'
import nodeMixin from '@/components/Templates/mixins/node'
import childrenMixin from '@/components/Templates/mixins/children'
import Grid from './Grid'
import { defaultSetting } from '../Setup/EditorSetting/SettingCarousel'
import { CHILDREN, LABEL, LAYERS } from '@/const'
import { CarouselItem, Carousel, Tooltip } from 'element-ui'
import { traversal } from '@/utils/tool'
import AsyncComponent from '@/components/TemplateUtils/AsyncComponent'

export default {
  defaultSetting,
  name: 'Carousel',
  components: {
    AsyncComponent,
    Grid,
    ElCarouselItem: CarouselItem,
    ElCarousel: Carousel,
    ElTooltip: Tooltip
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
    ...mapState('app', ['selectedComponentIds']),
    gridGenerators() {
      return this.innerChildren.filter(x => x[LABEL] === 'slider')
    },
    customerIndicator() {
      return this.innerChildren.find(x => x[LABEL] === 'indicators')
    },
    customerIndicatorNode() {
      return this.componentsMap[this.customerIndicator.id]
    },
    prevGridItemId() {
      return this.customerIndicatorNode[CHILDREN][0].id
    },
    nextGridItemId() {
      return this.customerIndicatorNode[CHILDREN][1].id
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
  },
  methods: {
    ...mapMutations('app', ['CLEAN_SELECTED_COMPONENT_ID']),
    checkSelectedComponent(index, oldIndex) {
      const { id } = this.gridGenerators[oldIndex]
      const node = this.componentsMap[id]
      const ids = []

      traversal(node, ({ id }) => ids.push(id))

      this.CLEAN_SELECTED_COMPONENT_ID(ids)
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

.el-carousel__item {
  background-color: #bbbec1;
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

.customer-indicator{
  position: absolute;
  width: 100%;
  z-index: 10;
  pointer-events: none;
}
</style>
