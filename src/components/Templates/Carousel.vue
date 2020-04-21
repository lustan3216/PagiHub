<template>
  <swiper
    ref="carousel"
    :style="innerStyles"
    :autoplay="false"
    :options="innerProps"
    trigger="click"
    class="wh-100"
  >
    <swiper-slide
      v-for="child in innerChildren"
      :ref="child.id"
      :key="child.id"
      @mouseover.native.stop="asd = child.id"
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
      asd: null
    }
  },
  computed: {
    parentEl() {
      return (
        this.$parent &&
        this.$parent.$el &&
        this.$parent.$el.setAttribute &&
        this.$parent.$el
      )
    }
  },
  methods: {
    mouseLeave() {
      // this.isEditableId = null
    },
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
</style>
