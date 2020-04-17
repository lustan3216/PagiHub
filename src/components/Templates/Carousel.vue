<template>
  <swiper
    ref="carousel"
    :style="innerStyles"
    :autoplay="false"
    trigger="click"
    class="wh-100"
  >
    <swiper-slide
      v-for="child in innerChildren"
      :ref="child.id"
      :key="child.id"
      @click.stop.native="click(child.id)"
      @mouseleave="mouseLeave"
    >
      <grid-generator
        :id="child.id"
        class="h-100"
      />
    </swiper-slide>
    <div
      slot="pagination"
      class="swiper-pagination"
    />
    <div
      slot="button-prev"
      class="swiper-button-prev"
    />
    <div
      slot="button-next"
      class="swiper-button-next"
    />
    <div
      slot="scrollbar"
      class="swiper-scrollbar"
    />
  </swiper>
</template>

<script>
import 'swiper/css/swiper.css'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import childrenMixin from './mixins/children'
import nodeMixin from './mixins/node'
import GridGenerator from './GridGenerator'

export default {
  name: 'Carousel',
  components: {
    Swiper,
    SwiperSlide,
    GridGenerator
  },
  mixins: [childrenMixin, nodeMixin],
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
