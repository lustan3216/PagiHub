<template>
  <div>
    <el-divider content-position="left">

      <el-dropdown
        size="small"
        @command="add"
      >
        <span class="el-dropdown-link">
          <el-button icon="el-icon-plus"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="option in selectableOptions"
            :key="option.name"
            :command="option.name"
          >
            {{ humanize(option.name) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-button
        v-if="values.find(x => !x.visible)"
        icon="el-icon-delete"
        class="m-l-0"
        @click="clean"
      />

      TRANSFORM
    </el-divider>

    <el-row
      v-for="option in values"
      :key="option.name"
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

      <el-col :span="8">
        <span class="title">{{ humanize(option.name) }}</span>
      </el-col>

      <el-col :span="12">
        <select-unit
          v-if="options[option.name]"
          :value="option.value || options[option.name].default"
          :clearable="false"
          :key="option.name"
          v-bind="options[option.name]"
          @input="option.value = $event"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { InputNumber, Divider } from 'element-ui'
import SelectUnit from '@/components/Components/SelectUnit'
import InputUnit from '@/components/Components/InputUnit'
import { humanize } from '@/utils/string'
import { isArray, cloneJson } from '@/utils/tool'

export default {
  name: 'Transform',
  components: {
    ElInputNumber: InputNumber,
    SelectUnit,
    InputUnit,
    ElDivider: Divider
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
    const rotate = this.getValue(this.value, 'rotate')[0]
    const [skewX, skewY] = this.getValue(this.value, 'skew')
    const [scaleX, scaleY] = this.getValue(this.value, 'scale')
    const [translateX, translateY] = this.getValue(this.value, 'translate')
    const [originX, originY] = this.getValue(this.origin, 'origin')

    const options = {
      originX: {
        name: 'originX',
        step: 1,
        units: ['%'],
        default: '50%',
        value: originX,
        visible: true
      },
      originY: {
        name: 'originY',
        step: 1,
        units: ['%'],
        default: '50%',
        value: originY || originX,
        visible: true
      },
      skewX: {
        name: 'skewX',
        max: 360,
        step: 1,
        min: -360,
        units: ['deg'],
        value: skewX,
        visible: true
      },
      skewY: {
        name: 'skewY',
        step: 1,
        max: 360,
        min: -360,
        units: ['deg'],
        value: skewY || skewX,
        visible: true
      },
      translateX: {
        name: 'translateX',
        step: 1,
        allowNegative: true,
        units: ['px', '%'],
        value: translateX,
        visible: true
      },
      translateY: {
        name: 'translateY',
        step: 1,
        allowNegative: true,
        units: ['px', '%'],
        value: translateY || translateX,
        visible: true
      },
      scaleX: {
        name: 'scaleX',
        step: 0.01,
        default: 1,
        max: 3,
        min: -3,
        units: [],
        value: scaleX,
        visible: true
      },
      scaleY: {
        name: 'scaleY',
        max: 3,
        default: 1,
        min: -3,
        step: 0.01,
        units: [],
        value: scaleY || scaleX,
        visible: true
      }
    }

    return {
      options,
      rotate,
      transform: null,
      transformOrigin: null,
      values: Object.values(options).reduce((acc, x) => {
        if (x.value) {
          acc.push(cloneJson(x))
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
    value(value) {
      this.rotate = this.getValue(value, 'rotate')[0]
    },
    values: {
      handler(values) {
        const {
          skewX,
          skewY,
          translateX,
          translateY,
          scaleX = 1,
          scaleY = 1,
          originX = '50%',
          originY = '50%'
        } = values.reduce((acc, effect) => {
          if (effect.value || effect.value === 0) {
            acc[effect.name] = effect.value
          }
          return acc
        }, {})
        const rotate = this.rotate && `rotate(${this.rotate})`
        const skew = this.bindValue(skewX, skewY, 'skew')
        const translate = this.bindValue(translateX, translateY, 'translate')
        const scale = scaleX === scaleY && scaleX === 1
          ? ''
          : this.bindValue(scaleX, scaleY, 'scale')

        this.transform = [rotate, skew, translate, scale].filter(x => x).join(' ').trim()
        this.transformOrigin = originX === originY && originY === '50%'
          ? ''
          : `${originX} ${originY}`
      },
      deep: true
    },
    transform(transform) {
      this.$emit('change', { transform })
    },
    transformOrigin(transformOrigin) {
      this.$emit('change', { transformOrigin })
    }
  },
  methods: {
    getValue(value, key) {
      const regex = new RegExp(`${key}\\(([^(]+)\\)`)
      const match = value.match(regex) || []
      if (match[1]) {
        const [a, b = ''] = match[1].split(',')
        return [a, b]
      } else {
        return ['', '']
      }
    },
    isArray,
    humanize,
    bindValue(a = 0, b = 0, attr) {
      if (!a && !b) {
        return ''
      } else if (a === b) {
        return `${attr}(${a})`
      } else if (attr) {
        return `${attr}(${a},${b})`
      }
    },
    clean() {
      this.values = this.values.filter(x => x.visible)
    },
    add(name) {
      this.values.push({ name, value: this.options[name].default, visible: true })
    }
  }
}
</script>

<style scoped lang="scss">
.el-input-number {
  margin-top: 1px;
}
</style>
