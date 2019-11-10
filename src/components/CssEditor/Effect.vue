<template>
  <div>
    <div>
      <p>opacity</p>
      <input-unit
        :value.sync="opacity"
        min="0" />
    </div>
    <div>
      <p>blur</p>
      <input-unit
        :value.sync="blur"
        unit="px"
        min="0" />
    </div>
    <div>
      <p>brightness</p>
      <input-unit
        :value.sync="brightness"
        min="0" />
    </div>
    <div>
      <p>contrast</p>
      <input-unit
        :value.sync="contrast"
        unit="%"
        min="0" />
    </div>
    <div>
      <p>grayscale</p>
      <input-unit
        :value.sync="grayscale"
        unit="%"
        min="0" />
    </div>
    <div>
      <p>hue-rotate</p>
      <input-unit
        :value.sync="hueRotate"
        unit="deg"
        min="0" />
    </div>
    <div>
      <p>invert</p>
      <input-unit
        :value.sync="invert"
        unit="%"
        min="0" />
    </div>
    <div>
      <p>saturate</p>
      <input-unit
        :value.sync="saturate"
        min="0" />
    </div>
    <div>
      <p>sepia</p>
      <input-unit
        :value.sync="sepia"
        unit="%"
        min="0" />
    </div>
  </div>
</template>

<script>
import styleMixin from '../../mixins/style'
import InputUnit from './Components/InputUnit'

const effects = ['opacity', 'blur', 'brightness', 'contrast', 'grayscale', 'hueRotate', 'invert', 'saturate', 'sepia']

export default {
  name: 'Effect',
  components: {
    InputUnit
  },
  mixins: [styleMixin],
  data() {
    const styles = this.getStyles()

    return effects.reduce((all, effect) => {
      all[effect] = styles[effect]
      return all
    }, {})
  },
  created() {
    effects.forEach(effect => {
      this.$watch(effect, value => {
        this.assignStyles({ filter: value ? `${effect}(${value})` : null })
      })
    })
  }
}
</script>

<style scoped lang="scss">
.el-input-number {
  margin-top: 1px;
}
</style>
