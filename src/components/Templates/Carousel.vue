<template>
  <div
    v-observe-visibility="options"
    :style="innerStyles.html"
    class="h-100 over-hidden"
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
        v-for="(child, index) in gridGenerators"
        :key="child.id"
        :class="`carousel-item-${id}`"
      >
        <component-giver
          v-if="index === currentIndex"
          :id="child.id"
        />
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
import Grid from './GridGenerator'
import { defaultSetting } from '../Setup/EditorSetting/SettingCarousel'
import { CHILDREN, POLYMORPHISM } from '@/const'
import { CarouselItem, Carousel } from 'element-ui'
import { traversalSelfAndChildren } from '@/utils/node'
import { vmRemoveNode } from '@/utils/vmMap'
import ComponentGiver from '@/components/TemplateUtils/ComponentGiver'

export default {
  defaultSetting,
  name: 'Carousel',
  components: {
    ComponentGiver,
    Grid,
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
    ...mapState('app', ['selectedComponentIds']),
    gridGenerators() {
      return this.innerChildren.filter(x => x[POLYMORPHISM] === 'slider')
    },
    customerIndicator() {
      return this.innerChildren.find(x => x[POLYMORPHISM] === 'indicators')
    },
    customerIndicatorNode() {
      return this.nodesMap[this.customerIndicator.id]
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
  },
  methods: {
    ...mapMutations('app', ['CLEAN_SELECTED_COMPONENT_ID']),
    checkSelectedComponent(index, oldIndex) {
      const { id } = this.gridGenerators[oldIndex]
      const node = this.nodesMap[id]
      const ids = []
      this.currentIndex = index
      traversalSelfAndChildren(node, ({ id }) => ids.push(id))

      this.CLEAN_SELECTED_COMPONENT_ID(ids)
    },
    removeCurrentSlider() {
      const node = this.children[this.currentIndex]
      vmRemoveNode(node)
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
  background-color: #9c9c9c;
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

.customer-indicator {
  position: absolute;
  width: 100%;
  z-index: 10;
  pointer-events: none;
}
</style>
