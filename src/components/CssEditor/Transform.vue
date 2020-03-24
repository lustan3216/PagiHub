<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <p>opacity</p>
      <el-slider
        :value="parseInt(computedStyle.opacity)"
        :min="0"
        :max="1"
        :step="0.01"
      />
    </el-col>

    <el-col :span="24">
      <p>blur</p>
      <el-slider
        :value="parseInt(computedStyle.blur)"
        :min="0"
        :max="30"
        :step="0.1"
      />
    </el-col>

    <el-col :span="24">
      <p>brightness</p>
      <el-slider
        :value="parseInt(computedStyle.brightness)"
        :min="0"
        :max="200"
      />
    </el-col>

    <el-col :span="24">
      <p>contrast</p>
      <el-slider
        :value="parseInt(computedStyle.contrast)"
        :min="0"
        :max="200"
      />
    </el-col>

    <el-col :span="24">
      <p>grayscale</p>
      <el-slider
        :value="parseInt(computedStyle.grayscale)"
        :min="0"
        :max="100"
      />
    </el-col>

    <el-col :span="24">
      <p>hue-rotate</p>
      <el-slider
        :value="parseInt(computedStyle.hueRotate)"
        :min="0"
        :max="360"
      />
    </el-col>

    <el-col :span="24">
      <p>invert</p>
      <el-slider
        :value="parseInt(computedStyle.brightness)"
        :min="0"
        :max="100"
      />
    </el-col>

    <el-col :span="24">
      <p>saturate</p>
      <el-slider
        :value="parseInt(computedStyle.saturate)"
        :min="0"
        :max="1"
        :step="0.01"
      />
    </el-col>

    <el-col :span="24">
      <p>sepia</p>
      <el-slider
        :value="parseInt(computedStyle.sepia)"
        :min="0"
        :max="1"
        :step="0.01"
      />
    </el-col>
  </el-row>
</template>

<script>
import InputUnit from './Components/InputUnit'

export default {
  name: 'Effect',
  components: {
    InputUnit
  },
  props: ['computedStyle'],
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
  created() {
    // effects.forEach(effect => {
    //   this.$watch(effect, value => {
    //     this.assignStyles({ filter: value ? `${effect}(${value})` : null })
    //   })
    // })
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
