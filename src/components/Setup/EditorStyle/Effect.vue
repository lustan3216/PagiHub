<template>
  <div>
    <el-divider content-position="left">
      <el-dropdown
        size="small"
        @command="filterArray.push({ name: $event, value: 0, visible: true })"
      >
        <span class="el-dropdown-link">
          <el-button icon="el-icon-plus" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="option in selectableOptions"
            :key="option.name"
            :command="option"
          >
            {{ humanize(option) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      EFFECT
    </el-divider>

    <el-row
      v-for="(option, index) in filterArray"
      :key="option.name"
      :gutter="5"
      type="flex"
      align="middle"
    >
      <el-col :span="8">
        <span class="title">{{ humanize(option.name) }}</span>
      </el-col>

      <el-col :span="13">
        <select-unit
          v-if="option.name"
          :value="option.value || options[option.name].default"
          :min="0"
          :clearable="false"
          v-bind="options[option.name]"
          @input="onChange(index, $event)"
        />
      </el-col>

      <el-col :span="3">
        <el-button
          icon="el-icon-delete"
          @input="itemRemove(index)"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import forNodeMixin from './mixins/forNode'
import { arrayLast, deleteBy } from '@/utils/array'
import { humanize, splitAt } from '@/utils/string'

export default {
  name: 'Effect',
  mixins: [forNodeMixin('filter')],
  components: {
    SelectUnit
  },
  data() {
    return {
      filterArray: []
    }
  },
  computed: {
    options() {
      return {
        blur: {
          name: 'blur',
          default: 0,
          min: -30,
          max: 30,
          step: 0.1,
          units: 'px',
          visible: true
        },
        brightness: {
          name: 'brightness',
          default: 1,
          min: 0,
          max: 4,
          step: 0.01,
          units: '',
          visible: true
        },
        contrast: {
          name: 'contrast',
          max: 2,
          default: 1,
          step: 0.01,
          units: '',
          visible: true
        },
        grayscale: {
          name: 'grayscale',
          default: 0,
          min: 0,
          max: 1,
          step: 0.01,
          units: '',
          visible: true
        },
        'hue-rotate': {
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
          units: '',
          visible: true
        },
        sepia: {
          name: 'sepia',
          default: 0,
          min: 0,
          step: 0.01,
          max: 1,
          units: '',
          visible: true
        },
        invert: {
          name: 'invert',
          default: 0,
          min: 0,
          step: 0.01,
          max: 1,
          units: '',
          visible: true
        }
      }
    },
    selectableOptions() {
      return Object.keys(this.options).filter(
        name => !this.filterArray.map(x => x.name).includes(name)
      )
    },
    filter() {
      return arrayLast(this.allValues) || ''
    }
  },
  watch: {
    selectedComponentNodes: {
      handler() {
        this.departFilterToArray()
      },
      immediate: true
    }
  },
  methods: {
    humanize,
    onChange(index, value) {
      this.filterArray[index].value = value
      this.recordStyles({ filter: this.stringify(this.filterArray) })
    },
    stringify(filterArray) {
      return filterArray
        .filter(effect => effect.name && effect.value)
        .map(effect => {
          const options = this.options[effect.name]
          return `${options.name}(${parseFloat(effect.value)}${options.units})`
        })
        .join(' ')
    },
    departFilterToArray() {
      const split = this.filter.match(/[^)|\s]+\)/g) || []

      this.filterArray = split.map(data => {
        const [key, value] = splitAt(data, data.indexOf('('))
        const effect = this.options[key]

        return {
          ...effect,
          value: value.match(/[\d|.]+/)[0]
        }
      })
    },
    itemRemove(index) {
      deleteBy(this.filterArray, index)
      this.recordStyles({ filter: this.filterArray })
    }
  }
}
</script>

<style scoped lang="scss">
.el-input-number {
  margin-top: 1px;
}
</style>
