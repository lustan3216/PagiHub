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
            :key="option.name"
            :label="humanize(option.name)"
            :value="option.name"
          />
        </el-select>
      </el-col>

      <el-col :span="10">
        <input-number
          v-if="option.name"
          v-model="option.value"
          :min="0"
          :max="100"
          controls-position="right"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { InputNumber } from 'element-ui'
import { splitAt } from '@/utils/tool'
import { humanize } from '@/utils/string'

export default {
  name: 'Effect',
  components: {
    InputNumber
  },
  props: {
    value: {
      type: String,
      required: true
    },
    opacity: {
      type: String,
      required: true
    }
  },
  data() {
    const options = [
      {
        name: 'opacity',
        max: 1,
        unit: ''
      },
      {
        name: 'blur',
        max: 30,
        unit: 'px'
      },
      {
        name: 'brightness',
        max: 1,
        unit: ''
      },
      {
        name: 'contrast',
        max: 200,
        unit: '%'
      },
      {
        name: 'grayscale',
        max: 100,
        unit: '%'
      },
      {
        name: 'hue-rotate',
        label: 'hue',
        max: 360,
        unit: 'deg'
      },
      {
        name: 'saturate',
        max: 200,
        unit: '%'
      },
      {
        name: 'sepia',
        max: 200,
        unit: '%'
      }
    ]

    const split = this.value.match(/[^\)|\s]+\)/g) || []

    const values = split.map(data => {
      const [key, value] = splitAt(data, data.indexOf('('))
      const effect = options.find(x => x.name === key)

      return {
        ...effect,
        value: (value / effect.max) * 100
      }
    })

    if (this.opacity !== '1') {
      values.push({
        ...options[0],
        value: parseInt(this.opacity)
      })
    }

    return {
      options,
      values
    }
  },
  computed: {
    selectableOptions() {
      return this.options.filter(
        ({ name }) => !this.values.map(x => x.name).includes(name)
      )
    }
  },
  watch: {
    values: {
      handler(values) {
        const result = values
          .filter(x => x.name && x.value && x.name !== 'opacity')
          .map(x => {
            const effect = this.options.find(effect => effect.name === x.name)
            return `${effect.name}(${(effect.max / 100) * x.value}${
              effect.unit
            })`
          })
          .join(' ')

        this.$emit('update:value', result)

        const opacity = values.find(x => x.name === 'opacity')
        if (opacity) {
          this.$emit('update:opacity', opacity.value.toString())
        }
      },
      deep: true
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
