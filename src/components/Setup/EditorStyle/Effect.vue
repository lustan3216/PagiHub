<template>
  <div>
    <el-row
      :gutter="5"
      class="m-t-10"
    >
      <el-col :span="8">
        <el-form-item label="Opacity">
          <input-unit
            :value="parseInt(computedStyle.opacity)"
            :min="0"
            :max="1"
          />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="Blur">
          <input-unit
            :value="parseInt(computedStyle.blur)"
            :min="0"
            :max="30"
          />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="Brightness">
          <input-unit
            :value="parseInt(computedStyle.brightness)"
            :min="0"
            :max="200"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row
      :gutter="5"
      class="m-t-10"
    >
      <el-col :span="8">
        <el-form-item label="Contrast">
          <input-unit
            :value="parseInt(computedStyle.contrast)"
            :min="0"
            :max="200"
          />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="Grayscale">
          <input-unit
            :value="parseInt(computedStyle.grayscale)"
            :min="0"
            :max="100"
          />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="Hue">
          <input-unit
            :value="parseInt(computedStyle.hueRotate)"
            :min="0"
            :max="360"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row
      :gutter="5"
      class="m-t-10"
    >
      <el-col :span="8">
        <el-form-item label="Brightness">
          <input-unit
            :value="parseInt(computedStyle.brightness)"
            :min="0"
            :max="100"
          />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="Saturate">
          <input-unit
            :value="parseInt(computedStyle.saturate)"
            :min="0"
            :max="1"
          />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="Sepia">
          <input-unit
            :value="parseInt(computedStyle.sepia)"
            :min="0"
            :max="1"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import InputUnit from '@/components/Components/InputUnit'

export default {
  name: 'Effect',
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
