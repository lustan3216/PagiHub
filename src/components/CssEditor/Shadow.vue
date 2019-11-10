<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <p>Horizontal Length</p>
      <input-unit
        :value.sync="horizontal"
        unit="px" />
    </el-col>

    <el-col :span="24">
      <p>Vertical Length</p>
      <input-unit
        :value.sync="vertical"
        unit="px" />
    </el-col>

    <el-col :span="24">
      <p>Blur Radius</p>
      <input-unit
        :value.sync="blur"
        unit="px" />
    </el-col>

    <el-col :span="24">
      <p>Spread Radius</p>
      <input-unit
        :value.sync="spread"
        unit="px" />
    </el-col>

    <el-col :span="24">
      <p>Shadow Color</p>
      <el-color-picker
        v-model="color"
        show-alpha />
    </el-col>

    <el-col :span="24">
      <el-radio
        v-model="radio"
        label="Outline">Outline</el-radio>
      <el-radio
        v-model="radio"
        label="Inset">Inset</el-radio>
    </el-col>
  </el-row>
</template>

<script>
import styleMixin from '../../mixins/style'
import InputUnit from './Components/InputUnit'

export default {
  name: 'Shadow',
  components: {
    InputUnit
  },
  mixins: [styleMixin],
  data() {
    const styles = this.getStyles()
    console.log()
    return {
      boxShadow: styles.boxShadow,
      radio: null,
      horizontal: null,
      vertical: null,
      blur: null,
      spread: null,
      color: null
    }
  },
  computed: {
    isNone() {
      return this.boxShadow === 'none'
    },
    match() {
      if (this.isNone) {
        return ['', '', '', '', '', '']
      } else if (this.boxShadow.includes('inset')) {
        return this.boxShadow.split(' ')
      } else {
        return this.boxShadow.split(' ').unshift('')
      }
    },
    radio: {
      get() {
        return this.match[0]
      },
      set(value) {}
    },
    horizontal: {
      get() {
        return this.match[1]
      },
      set() {}
    },
    vertical: {
      get() {
        return this.match[2]
      },
      set() {}
    },
    blur: {
      get() {
        return this.match[3]
      },
      set() {}
    },
    spread: {
      get() {
        return this.match[4]
      },
      set() {}
    },
    color: {
      get() {
        return this.match[5]
      },
      set() {}
    }
  }
}
</script>

<style scoped lang="scss"></style>
