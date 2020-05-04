<template>
  <div>
    <span class="title p-r-10">Effect</span>
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
        >
          <el-option
            v-for="option in selectableOptions"
            :key="option"
            :label="humanize(option)"
            :value="option"
          />
        </el-select>
      </el-col>

      <el-col :span="10">
        <select-unit
          v-if="option.name"
          :value="option.value || options[option.name].default"
          :min="0"
          :clearable="false"
          v-bind="options[option.name]"
          @input="option.value = $event"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import { splitAt } from '@/utils/tool'
import { humanize } from '@/utils/string'

export default {
  name: 'Effect',
  components: {
    SelectUnit
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    const options = {
      opacity: {
        name: 'opacity',
        min: 0,
        max: 1,
        step: 0.01,
        default: 1,
        units: ''
      },
      blur: {
        name: 'blur',
        default: 0,
        min: -30,
        max: 30,
        step: 0.1,
        units: 'px'
      },
      brightness: {
        name: 'brightness',
        default: 1,
        min: 0,
        max: 4,
        step: 0.01,
        units: ''
      },
      contrast: {
        name: 'contrast',
        max: 2,
        default: 1,
        step: 0.01,
        units: ''
      },
      grayscale: {
        name: 'grayscale',
        default: 0,
        min: 0,
        max: 1,
        step: 0.01,
        units: ''
      },
      hue: {
        name: 'hue-rotate',
        label: 'hue',
        default: 0,
        min: 0,
        max: 360,
        step: 0.1,
        units: 'deg'
      },
      saturate: {
        name: 'saturate',
        min: -10,
        max: 10,
        step: 0.01,
        default: 1,
        units: ''
      },
      sepia: {
        name: 'sepia',
        default: 0,
        min: 0,
        step: 0.01,
        max: 1,
        units: ''
      },
      invert: {
        name: 'invert',
        default: 0,
        min: 0,
        step: 0.01,
        max: 1,
        units: ''
      }
    }

    const split = this.value.match(/[^)|\s]+\)/g) || []

    const values = split.map(data => {
      const [key, value] = splitAt(data, data.indexOf('('))
      const effect = options[key]

      return {
        ...effect,
        value: value.match(/[\d|.]+/)[0]
      }
    })

    return {
      options,
      values,
      filter: null
    }
  },
  computed: {
    selectableOptions() {
      return Object.keys(this.options).filter(
        name => !this.values.map(x => x.name).includes(name)
      )
    }
  },
  watch: {
    values: {
      handler(values) {
        const filter = values
          .filter(x => x.name && x.value)
          .map(x => {
            const effect = this.options[x.name]
            return `${effect.name}(${parseFloat(x.value)}${effect.units})`
          })
          .join(' ')

        this.filter = filter
      },
      deep: true,
      immediate: true
    },
    filter(filter) {
      this.$emit('change', { filter })
    }
  },
  methods: {
    humanize
  }
}
</script>

<style scoped lang="scss">
.el-input-number {
  margin-top: 1px;
}
</style>
