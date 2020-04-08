<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="6">
      <template slot="title">
        <span class="el-dropdown">Style</span>
        <el-button
          v-if="hasError"
          circle
          type="text"
          icon="el-icon-warning"
        />
      </template>

      <el-input
        :rows="10"
        v-model="styles"
        type="textarea"
        @change="cssoStyle"
      />
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import csso from 'csso'

export default {
  name: 'StyleBlock',
  // eslint-disable-next-line
  props: ['planStyle'],
  data() {
    return {
      activeNames: '',
      styles: this.beautify(this.planStyle),
      hasError: false
    }
  },
  methods: {
    cssoStyle() {
      let result
      try {
        result = csso.minifyBlock(this.styles)
      } catch {
        this.hasError = true
        return
      }
      this.hasError = false
      this.styles = this.beautify(result.css)
      this.$emit('change', this.cssStringToObject(result.css))
    },
    beautify(css) {
      return (css || '').replace(/;/g, ';\n').replace(/^\s+/gm, '')
    },
    cssStringToObject(cssString) {
      return cssString.split(';').reduce((all, string) => {
        const [key, value] = string.split(':')
        all[key.camelCase()] = value
        return all
      }, {})
    }
  }
}
</script>
