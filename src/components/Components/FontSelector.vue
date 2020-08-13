<template>
  <el-select
    v-model="innerValue"
    filterable
    allow-create
  >
    <el-option
      v-for="font in fontNames"
      :value="font"
      :key="font"
      :label="font"
      :style="{ fontFamily: font }"
    />
  </el-select>
</template>

<script>
  import { Message } from 'element-ui'
  import WebFont from 'webfontloader'
  import localforage from 'localforage'
  import { arrayUniq } from '../../utils/tool'
  const EXTRA_FONTS = 'extraFonts'

  export default {
    name: 'FontSelector',
    props: {
      value: {
        type: String,
        default: 'Inter'
      }
    },
    data() {
      return {
        innerValue: this.value,
        fontNames: ['Inter', 'Circular', 'Roboto', 'Helvetica Neue', 'sans-serif', 'Courier New', 'Courier', 'Arial Narrow', 'Candara', 'Calibri', 'Optima', 'Cambria', 'Garamond', 'Perpetua', 'Didot', 'Brush Script MT', 'Lucida Bright', 'Copperplate', 'Verdana', 'Times New Roman', 'Helvetica', 'Times', "Alfa Slab One", "Arial", "Bitter", "Changa One", "DM Sans", "DM Serif Display", "Droid Sans", "Droid Serif", "Exo", "Fanwood Text", "Fira Sans", "Georgia", "Great Vibes", "Impact", "Inconsolata", "Lato", "Merriweather", "Montserrat", "Nunito"]
      }
    },
    created() {
      WebFont.load({
          classes: false,
          events: false,
          google: {
            families: this.fontNames
          },
      })

      localforage.getItem(EXTRA_FONTS).then(fonts => {
        if (!Array.isArray(fonts)) {
          fonts = []
        }

        this.fontNames = [...fonts, ...this.fontNames]
          // 這裡不用再載入一次 value裡面的font, 因為TextEditorInner已經做過了
          if (!this.fontNames.includes(this.value)) {
            this.fontNames.unshift(this.value)
            fonts.push(this.value)
            localforage.setItem(EXTRA_FONTS, arrayUniq(fonts))
          }
      })
    },
    watch: {
      value(value) {
        this.innerValue = value
      },
      innerValue(value) {
        if (this.fontNames.includes(value)) {
          this.$emit('change', value)
        } else {

          WebFont.load({
            classes: false,
            google: {
              families: [value]
            },
            fontactive: async (familyName) => {
              this.$emit('change', familyName)
              this.fontNames.unshift(familyName)

              let fonts = await localforage.getItem(EXTRA_FONTS)
              if (!fonts) {
                fonts = []
              }

              fonts.push(familyName)
              localforage.setItem(EXTRA_FONTS, arrayUniq(fonts))
            },
            fontinactive: familyName => {
              this.innerValue = undefined
              Message.warning(`Import ${familyName} fail, please check space and character capital again.`)
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
