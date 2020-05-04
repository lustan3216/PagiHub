<template>
  <div>
    <span class="title p-r-10">Transform</span>
    <el-button
      type="text"
      icon="el-icon-circle-plus-outline"
      @click="values.push({ value: 0, name: null })"
    />

    <el-row
      v-for="(option, index) in values"
      :key="option.name"
      :gutter="10"
      class="w-100"
      type="flex"
    >
      <el-col :span="2">
        <el-button
          type="text"
          icon="el-icon-remove-outline"
          @click="values.splice(index, 1)"
        />
      </el-col>

      <el-col :span="12">
        <el-select
          v-model="option.name"
          placeholder="Choose effect"
          @change="option.value = null"
        >
          <el-option
            v-for="option in selectableOptions"
            :key="option.name"
            :label="humanize(option.name)"
            :value="option.name"
          />
        </el-select>
      </el-col>

      <el-col :span="10">
        <template v-if="options[option.name]">
          <select-unit
            :value="option.value || options[option.name].default"
            :clearable="false"
            :key="option.name"
            v-bind="options[option.name]"
            @input="option.value = $event"
          />
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { InputNumber } from 'element-ui'
import SelectUnit from '@/components/Components/SelectUnit'
import InputUnit from '@/components/Components/InputUnit'
import { humanize } from '@/utils/string'
import { isArray } from '@/utils/tool'

export default {
  name: 'Transform',
  components: {
    ElInputNumber: InputNumber,
    SelectUnit,
    InputUnit
  },
  props: {
    value: {
      type: String,
      required: true
    },
    origin: {
      type: String,
      required: true
    }
  },
  data() {
    const rotate = this.value.match(/rotate\(([^(]+)\)/) || []
    const skew = this.value.match(/skew\(([^(]+)\)/) || []
    const scale = this.value.match(/scale\(([^(]+)\)/) || []
    const translate = this.value.match(/translate\(([^(]+)\)/) || []

    const [skewX, skewY] = (skew[1] || '').split(',')
    const [scaleX, scaleY] = (scale[1] || '').split(',')
    const [translateX, translateY] = (translate[1] || '').split(',')
    const [originX, originY] = this.origin.split(' ')

    const options = {
      rotate: {
        name: 'rotate',
        max: 360,
        step: 0.1,
        min: -360,
        units: ['deg'],
        value: rotate[1]
      },
      originX: {
        name: 'originX',
        step: 0.1,
        units: ['%'],
        default: '50%',
        value: originX === '50%' ? null : originX
      },
      originY: {
        name: 'originY',
        step: 0.1,
        units: ['%'],
        default: '50%',
        value: originY === '50%' ? null : originY || originX
      },
      skewX: {
        name: 'skewX',
        max: 360,
        step: 0.1,
        min: -360,
        units: ['deg'],
        value: skewX
      },
      skewY: {
        name: 'skewY',
        step: 0.1,
        max: 360,
        min: -360,
        units: ['deg'],
        value: skewY || skewX
      },
      translateX: {
        name: 'translateX',
        step: 0.1,
        units: ['px', '%'],
        value: translateX
      },
      translateY: {
        name: 'translateY',
        step: 0.1,
        units: ['px', '%'],
        value: translateY || translateX
      },
      scaleX: {
        name: 'scaleX',
        step: 0.01,
        default: 1,
        max: 3,
        min: -3,
        units: [],
        value: scaleX
      },
      scaleY: {
        name: 'scaleY',
        max: 3,
        default: 1,
        min: -3,
        step: 0.01,
        units: [],
        value: scaleY || scaleX
      }
    }

    return {
      options,
      transform: null,
      transformOrigin: null,
      values: Object.values(options).reduce((acc, x) => {
        if (x.value) {
          acc.push({ ...x })
        }
        return acc
      }, [])
    }
  },
  computed: {
    selectableOptions() {
      return Object.values(this.options).filter(
        ({ name }) => !this.values.map(x => x.name).includes(name)
      )
    }
  },
  watch: {
    values: {
      handler(values) {
        const {
          skewX,
          skewY,
          rotate,
          translateX,
          translateY,
          scaleX = 1,
          scaleY = 1,
          originX,
          originY
        } = values.reduce((acc, effect) => {
          if (effect.value || effect.value === 0) {
            acc[effect.name] = effect.value
          }
          return acc
        }, {})
        const _rotate = rotate && `rotate(${rotate})`
        const skew = this.bindValue(skewX, skewY, 'skew')
        const translate = this.bindValue(translateX, translateY, 'translate')
        const scale = this.bindValue(scaleX, scaleY, 'scale')

        this.transform = [_rotate, skew, translate, scale].join(' ').trim()
        this.transformOrigin = this.bindValue(originX, originY)
      },
      deep: true,
      immediate: true
    },
    transform(transform) {
      this.$emit('change', { transform })
    },
    transformOrigin(transformOrigin) {
      this.$emit('change', { transformOrigin })
    }
  },
  methods: {
    isArray,
    humanize,
    bindValue(a = 0, b = 0, attr) {
      if (!a && !b) {
        return ''
      } else if (a === b) {
        return `${attr}(${a})`
      } else if (attr) {
        return `${attr}(${a}, ${b})`
      } else {
        return `${a} ${b}`
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-input-number {
  margin-top: 1px;
}
</style>
