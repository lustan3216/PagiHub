<template>
  <el-carousel
    ref="carousel"
    :style="innerStyles"
    :autoplay="false"
    trigger="click"
    class="wh-100"
  >
    <el-carousel-item
      v-for="child in innerChildren"
      v-if="child.visible !== false"
      :ref="child.id"
      :key="child.id"
      :name="child.id.toString()"
      :style="child.styles"
      @click.stop.native="click(child.id)"
      @mouseleave="mouseLeave"
    >
      <el-popover
        :value="isEditBarVisible(child.id)"
        :open-delay="100"
        :close-delay="0"
        :key="`popover${child.id}`"
        :ref="child.id"
        trigger="manual"
        placement="right"
      >
        <edit-bar :id="child.id" />
      </el-popover>

      <grid-generator v-bind="child" class="h-100" />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import { onVisibleChange } from '../../buses/visibility'
import childrenMixin from '../../mixins/children'
import commonMixin from '../../mixins/common'
import EditBar from './Components/EditBar'
import GridGenerator from './GridGenerator'

export default {
  name: 'Carousel',
  components: {
    GridGenerator,
    EditBar
  },
  mixins: [childrenMixin, commonMixin],
  data() {
    return {
      isEditableId: null
    }
  },
  watch: {
    innerChildren() {
      this.onVisibleChange()
    }
  },
  mounted() {
    this.onVisibleChange()
  },
  methods: {
    onVisibleChange() {
      this.innerChildren.forEach(child => {
        onVisibleChange(child.id, ({ visible }) => {
          // 沒有註冊在data裡面，所以直接set
          this.$set(child, 'visible', visible)
        })
      })
    },
    mouseLeave() {
      this.isEditableId = null
    },
    click(id) {
      this.openEditBarById(id)
      this.isEditableId = id
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
