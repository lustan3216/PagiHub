<template>
  <div style="padding-top: 1px;">
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
            {{ humanize(option.name) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-button
        v-if="values.find(x => !x.visible)"
        icon="el-icon-delete"
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
import { isArray } from '@/utils/tool'

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
    const rotate = this.value.match(/rotate\(([^(]+)\)/) || []
    const skew = this.value.match(/skew\(([^(]+)\)/) || []
    const scale = this.value.match(/scale\(([^(]+)\)/) || []
    const translate = this.value.match(/translate\(([^(]+)\)/) || []

    const [skewX, skewY] = (skew[1] || '').split(',')
    const [scaleX, scaleY] = (scale[1] || '').split(',')
    const [translateX, translateY] = (translate[1] || '').split(',')
    const [originX, originY] = this.origin.split(' ')

    const options = {
      originX: {
        name: 'originX',
        step: 0.1,
        units: ['%'],
        default: '50%',
        value: originX === '50%' ? null : originX,
        visible: true
      },
      originY: {
        name: 'originY',
        step: 0.1,
        units: ['%'],
        default: '50%',
        value: originY === '50%' ? null : originY || originX,
        visible: true
      },
      skewX: {
        name: 'skewX',
        max: 360,
        step: 0.1,
        min: -360,
        units: ['deg'],
        value: skewX,
        visible: true
      },
      skewY: {
        name: 'skewY',
        step: 0.1,
        max: 360,
        min: -360,
        units: ['deg'],
        value: skewY || skewX,
        visible: true
      },
      translateX: {
        name: 'translateX',
        step: 0.1,
        units: ['px', '%'],
        value: translateX,
        visible: true
      },
      translateY: {
        name: 'translateY',
        step: 0.1,
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
