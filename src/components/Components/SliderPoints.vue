<template>
  <div>
    <slider
      v-for="(point, index) in points"
      v-bind="{ ...$props, ...$attrs }"
      :value="point"
      :key="index"
      :marks="index ? {} : marks"
      :min="min"
      :max="max"
      :class="{
        width: !$attrs.vertical,
        zIndex100: index === points.length - 1
      }"
      :ref="index"
      class="absolute"
      show-tooltip
      @input="onInput(index, $event)"
      @change="onChange(index, $event)"
      @click.native="() => reset($event, index)"
    />
  </div>
</template>

<script>
import { Slider } from 'element-ui'

export default {
  name: 'SliderPoints',
  components: {
    Slider
  },
  props: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    // eslint-disable-next-line
    marks: Object,
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      points: this.value
    }
  },
  methods: {
    onInput(index, value) {
      if (this.points[index - 1] > value) return
      if (this.points[index + 1] < value) return

      this.points.splice(index, 1, value)
      this.$emit('input', this.points)
    },
    onChange(index, value) {
      if (this.points[index - 1] > value) {
        value = this.points[index - 1]
      }
      if (this.points[index + 1] < value) {
        value = this.points[index + 1]
      }

      this.points.splice(index, 1, value)
      this.$emit('input', this.points)
      this.$emit('change', this.points)
    },
    reset(event, index) {
      this.$nextTick(() => {
        this.$refs[index][0].firstValue = this.points[index]
      })
    }
  }
}
</script>

<style scoped lang="scss">
.width {
  width: calc(100% - 60px);
}
::v-deep.zIndex100 .el-slider__button-wrapper {
  z-index: 100;
}
</style>
