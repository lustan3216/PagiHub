<template>
  <div class="h-100">
    <layers-interact
      :id="layerInteractId"
      class="layers-interact"
    />
    <swiper
      ref="swiper"
      :style="innerStyles"
      :options="transformedInnerProps"
      :key="JSON.stringify(transformedInnerProps)"
      class="wh-100"
    >
      <swiper-slide
        v-for="child in gridGenerators"
        :ref="child.id"
        :key="child.id"
      >
        <portal
          v-if="isDraftMode && !isExample"
          :to="`GridItemChild${id}`"
        >
          <el-tooltip
            :content="
              canNotDrag
                ? 'Unlock to operate carousel and enable autoplay'
                : 'Lock to edit grid layout. Autoplay will stop for temporary'
            "
            effect="light"
            placement="top"
          >
            <el-button
              v-if="swiper"
              icon="el-icon-caret-left"
              class="left"
              circle
              @click="swiper.slidePrev()"
            />

            <el-button
              v-if="swiper"
              icon="el-icon-caret-right"
              class="right"
              circle
              @click="swiper.slideNext()"
            />
          </el-tooltip>
        </portal>

        <controller-layer
          :style="child.styles"
          :id="child.id"
        >
          <grid-generator
            :id="child.id"
            class="h-100"
          />
        </controller-layer>
      </swiper-slide>

      <div
        v-if="innerProps.pagination"
        slot="pagination"
        class="swiper-pagination"
      />

      <template v-if="innerProps.scrollBar">
        <div
          slot="scrollbar"
          class="swiper-scrollbar"
        />
      </template>
    </swiper>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import 'swiper/css/swiper.css'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
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
    Swiper,
    SwiperSlide,
    GridGenerator,
    ControllerLayer,
    LayersInteract
  },
  mixins: [childrenMixin, nodeMixin],
  data() {
    return {
      canNotDrag: false,
      currentIndex: 0,
      swiper: null
    }
  },
  computed: {
    gridGenerators() {
      return this.innerChildren.filter(x => x.tag === GRID_GENERATOR)
    },
    layerInteractId() {
      return this.innerChildren.filter(x => x.tag === LAYERS_INTERACT)[0].id
    },
    transformedInnerProps() {
      if (this.isDraftMode) {
        return {
          ...this.innerProps,
          freeMode: false,
          mousewheel: false,
          autoplay: false,
          allowTouchMove: false,
          keyboard: true,
          breakpoints: this.breakpoints,
          initialSlide: this.currentIndex
        }
      } else {
        return {
          ...this.innerProps,
          breakpoints: this.breakpoints
        }
      }
    },
    breakpoints() {
      return (this.innerProps.breakpoints || []).reduce((acc, x) => {
        acc[x.breakpoint] = x
        return acc
      }, {})
    },
    parentEl() {
      return (
        this.$parent &&
        this.$parent.$el &&
        this.$parent.$el.setAttribute &&
        this.$parent.$el
      )
    }
  },
  watch: {
    transformedInnerProps: {
      handler() {
        this.$nextTick(() => {
          this.swiper = this.$refs.swiper.$swiper
        })
      },
      immediate: true
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
  background-color: #d3dce6;
}
.left {
  right: 25px;
  top: -5px;
  position: absolute;
  padding: 5px;
  z-index: 10;
}
.right {
  right: -5px;
  top: -5px;
  position: absolute;
  padding: 5px;
  z-index: 10;
}
.layers-interact {
  z-index: 10;
  height: 0;
}
.rotate90 {
  transform: rotate(90deg);
}
</style>
