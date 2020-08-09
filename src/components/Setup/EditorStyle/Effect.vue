<template>
  <div class="m-t-20">
    <el-divider content-position="left">
      <el-dropdown
        size="small"
        @command="values.push({ name: $event, value: 0, visible: true })"
      >
        <span class="el-dropdown-link">
          <el-button icon="el-icon-plus"/>
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

      <el-button
        v-if="values.find(x => !x.visible)"
        icon="el-icon-delete"
      />

      EFFECT
    </el-divider>

    <el-row
      v-for="option in values"
      :key="option.name"
      :gutter="10"
      class="w-100"
      type="flex"
      align="middle"
    >
      <el-col
        :span="2"
        :offset="2"
      >
        <el-checkbox
          v-model="option.visible"
          style="margin-top: 7px;"
        />
      </el-col>

      <el-col :span="9">
        <span class="title">{{ humanize(option.name) }}</span>
      </el-col>

      <el-col :span="15">
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
import { Divider } from 'element-ui'
import { splitAt } from '@/utils/tool'
import { humanize } from '@/utils/string'

export default {
  name: 'Effect',
  components: {
    SelectUnit,
    ElDivider: Divider
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    const options = {
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
