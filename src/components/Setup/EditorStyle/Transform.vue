<template>
  <div>
    <el-row
      :gutter="5"
      class="m-t-10"
    >
      <el-col :span="8">
        <input-unit
          :value="parseInt(computedStyle.opacity)"
          :min="0"
          :max="1"
        />
        <span class="el-form-item__label">Opacity</span>
      </el-col>

      <el-col :span="8">
        <input-unit
          :value="parseInt(computedStyle.blur)"
          :min="0"
          :max="30"
        />
        <span class="el-form-item__label">Blur</span>
      </el-col>

      <el-col :span="8">
        <input-unit
          :value="parseInt(computedStyle.brightness)"
          :min="0"
          :max="200"
        />
        <span class="el-form-item__label">Brightness</span>
      </el-col>
    </el-row>

    <el-row
      :gutter="5"
      class="m-t-10"
    >
      <el-col :span="8">
        <input-unit
          :value="parseInt(computedStyle.contrast)"
          :min="0"
          :max="200"
        />
        <span class="el-form-item__label">Contrast</span>
      </el-col>

      <el-col :span="8">
        <input-unit
          :value="parseInt(computedStyle.grayscale)"
          :min="0"
          :max="100"
        />
        <span class="el-form-item__label">Grayscale</span>
      </el-col>

      <el-col :span="8">
        <input-unit
          :value="parseInt(computedStyle.hueRotate)"
          :min="0"
          :max="360"
        />
        <span class="el-form-item__label">Hue</span>
      </el-col>
    </el-row>

    <el-row
      :gutter="5"
      class="m-t-10"
    >
      <el-col :span="8">
        <input-unit
          :value="parseInt(computedStyle.brightness)"
          :min="0"
          :max="100"
        />
        <span class="el-form-item__label">Brightness</span>
      </el-col>

      <el-col :span="8">
        <input-unit
          :value="parseInt(computedStyle.saturate)"
          :min="0"
          :max="1"
        />
        <span class="el-form-item__label">Saturate</span>
      </el-col>

      <el-col :span="8">
        <input-unit
          :value="parseInt(computedStyle.sepia)"
          :min="0"
          :max="1"
        />
        <span class="el-form-item__label">Sepia</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import InputUnit from '@/components/Components/InputUnit'

export default {
  name: 'Transform',
  components: {
    InputUnit
  },
  props: {
    computedStyle: {
      type: Object,
      required: true
    }
  },
  data() {
    // const styles = this.getStyles()
    //
    // return effects.reduce((all, effect) => {
    //   all[effect] = styles[effect]
    //   return all
    // }, {})
    return {
      value1: ''
    }
  },
  methods: {
    parseInt(value) {
      return window.parseInt(value)
    }
  }
}
</script>

<style scoped lang="scss">
  .el-input-number {
    margin-top: 1px;
  }
</style>
