<template>
  <div>
    <span class="title p-r-10">Transform</span>
    <el-button
      type="text"
      icon="el-icon-circle-plus-outline"
      @click="values.push({ value: 0 })"
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
          @change="delete option.value"
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
            v-if="isArray(options[option.name].unit)"
            :value.sync="option.value"
            :exclude="['vh', 'vw']"
            :key="option.name"
            allow-negative
          />

          <input-unit
            v-else
            v-model="option.value"
            :min="options[option.name].min"
            :max="options[option.name].max"
            :step="options[option.name].step"
            :key="option.name"
            :unit="options[option.name].unit"
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
        min: -360,
        unit: 'deg',
        value: rotate[1]
      },
      originX: {
        name: 'originX',
        unit: '%',
        value: originX === '50%' ? null : originX
      },
      originY: {
        name: 'originY',
        unit: '%',
        value: originY === '50%' ? null : originY || originX
      },
      skewX: {
        name: 'skewX',
        unit: ['px', '%'],
        value: skewX
      },
      skewY: {
        name: 'skewY',
        unit: ['px', '%'],
        value: skewY || skewX
      },
      translateX: {
        name: 'translateX',
        unit: ['px', '%'],
        value: translateX
      },
      translateY: {
        name: 'translateY',
        unit: ['px', '%'],
        value: translateY || translateX
      },
      scaleX: {
        name: 'scaleX',
        step: 0.01,
        max: 3,
        min: -3,
        unit: '',
        value: scaleX
      },
      scaleY: {
        name: 'scaleY',
        max: 3,
        min: -3,
        step: 0.01,
        unit: '',
        value: scaleY || scaleX
      }
    }

    return {
      options,
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
          scaleX,
          scaleY,
          originX,
          originY
        } = values.reduce((acc, effect) => {
          acc[effect.name] = effect.value
          return acc
        }, {})
        const _rotate = rotate && `rotate(${rotate}deg)`
        const skew = this.bindValue('skew', skewX, skewY)
        const translate = this.bindValue('translate', translateX, translateY)
        const scale = this.bindValue('scale', scaleX, scaleY)

        this.$emit('update:value', [_rotate, skew, translate, scale].join(' '))
        this.$emit('update:origin', `${originX} ${originY}`)
      },
      deep: true
    }
  },
  methods: {
    isArray,
    humanize,
    bindValue(attr, a = 0, b = 0) {
      if (!a && !b) {
        return ''
      } else if (a === b) {
        return a
      } else {
        return `${attr}(${a}, ${b})`
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
