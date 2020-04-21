<template>
  <swiper
    ref="swiper"
    :style="innerStyles"
    :autoplay="false"
    :options="transformedInnerProps"
    :allow-touch-move="lockGridLayout"
    trigger="click"
    class="wh-100"
  >
    <swiper-slide
      v-for="child in innerChildren"
      :ref="child.id"
      :key="child.id"
      @mouseover.native.stop="asd = child.id"
    >
      <portal :to="`GridItemChild${id}`">
        <el-tooltip
          effect="light"
          content="To switch draggable between carousel and grid layout."
          placement="top"
        >
          <el-button
            :icon="lockGridLayout ? 'el-icon-unlock' : 'el-icon-lock'"
            class="lock"
            circle
            @click="lockGridLayout = !lockGridLayout"
          />
        </el-tooltip>
      </portal>

      <controller-layer
        :style="child.styles"
        :id="child.id"
        :data-no-action="lockGridLayout"
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

    <template v-if="innerProps.navigation">
      <div
        slot="button-prev"
        class="swiper-button-prev"
      />
      <div
        slot="button-next"
        class="swiper-button-next"
      />
    </template>

    <template v-if="innerProps.scrollBar">
      <div
        slot="scrollbar"
        class="swiper-scrollbar"
      />
    </template>
  </swiper>
</template>

<script>
import 'swiper/css/swiper.css'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import childrenMixin from '@/components/Templates/mixins/children'
import nodeMixin from '@/components/Templates/mixins/node'
import GridGenerator from './GridGenerator'
import ControllerLayer from '../TemplateUtils/ControllerLayer'

export default {
  name: 'Carousel',
  components: {
    Swiper,
    SwiperSlide,
    GridGenerator,
    ControllerLayer
  },
  mixins: [childrenMixin, nodeMixin],
  data() {
    return {
      asd: null,
      lockGridLayout: true
    }
  },
  computed: {
    transformedInnerProps() {
      return {
        ...this.innerProps,
        autoPlay: this.innerProps.autoPlay && this.lockGridLayout
      }
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
    lockGridLayout(value) {
      this.$refs.swiper.$swiper.allowTouchMove = value
    }
  },
  methods: {
    click(id) {
      // this.isEditableId = id
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
.lock {
  right: -5px;
  top: -5px;
  position: absolute;
  padding: 5px;
  z-index: 10;
}
</style>
