<template>
  <div>
    <div class="divider-with-button">
      <el-divider content-position="left">
        TRANSFORM
      </el-divider>

      <el-dropdown
        size="small"
        @command="add"
      >
        <span class="el-dropdown-link">
          <el-button icon="el-icon-plus" />
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
    </div>

    <!--    <transform-origin :state="state" />-->

    <template v-for="(option, index) in transformArray">
      <portal
        v-if="option.name === 'rotate'"
        to="Rotate"
      >
        <el-row
          :key="option.name"
          type="flex"
          align="middle"
        >
          <el-col :span="8">
            <span class="title">{{ humanize(option.name) }}</span>
          </el-col>

          <el-col :span="16">
            <select-unit
              v-if="options[option.name]"
              :value="option.value || options[option.name].default"
              :clearable="false"
              :key="option.name"
              v-bind="options[option.name]"
              @input="onChange(index, $event)"
            />
          </el-col>
        </el-row>
      </portal>
      <el-row
        v-else
        :gutter="5"
        :key="option.name"
        type="flex"
        align="middle"
      >
        <el-col :span="8">
          <span class="title">{{ humanize(option.name) }}</span>
        </el-col>

        <el-col :span="13">
          <select-unit
            v-if="options[option.name]"
            :value="option.value || options[option.name].default"
            :clearable="false"
            :key="option.name"
            v-bind="options[option.name]"
            @input="onChange(index, $event)"
          />
        </el-col>

        <el-col :span="3">
          <el-button
            icon="el-icon-delete"
            @click="itemRemove(index)"
          />
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
import { InputNumber } from 'element-ui'
import SelectUnit from '@/components/Components/SelectUnit'
import InputUnit from '@/components/Components/InputUnit'
import forNodeMixins from './mixins/forNode'
import { humanize } from '@/utils/string'
import { cloneJson } from '@/utils/tool'
import TransformOrigin from '@/components/Setup/EditorStyle/TransformOrigin'
import { deleteBy } from '@/utils/array'

export default {
  name: 'Transform',
  mixins: [forNodeMixins('transform')],
  components: {
    TransformOrigin,
    ElInputNumber: InputNumber,
    SelectUnit,
    InputUnit
  },
  data() {
    return {
      transformArray: []
    }
  },
  computed: {
    options() {
      return {
        rotate: {
          name: 'rotate',
          max: 360,
          step: 1,
          min: -360,
          units: ['deg'],
          visible: true
        },
        skewX: {
          name: 'skewX',
          max: 360,
          step: 1,
          min: -360,
          units: ['deg'],
          visible: true
        },
        skewY: {
          name: 'skewY',
          step: 1,
          max: 360,
          min: -360,
          units: ['deg'],
          visible: true
        },
        translateX: {
          name: 'translateX',
          step: 1,
          allowNegative: true,
          units: ['px', '%'],
          visible: true
        },
        translateY: {
          name: 'translateY',
          step: 1,
          allowNegative: true,
          units: ['px', '%'],
          visible: true
        },
        scaleX: {
          name: 'scaleX',
          step: 0.01,
          default: 1,
          max: 3,
          min: -3,
          units: [],
          visible: true
        },
        scaleY: {
          name: 'scaleY',
          max: 3,
          default: 1,
          min: -3,
          step: 0.01,
          units: [],
          visible: true
        }
      }
    },
    selectableOptions() {
      return Object.values(this.options).filter(
        ({ name }) => !this.transformArray.map(x => x.name).includes(name)
      )
    }
  },
  watch: {
    selectedComponentNodes: {
      handler() {
        this.departTransformToArray()
      },
      immediate: true
    }
  },
  methods: {
    onChange(index, value) {
      this.transformArray[index].value = value
      this.recordStyles({ transform: this.stringify(this.transformArray) })
    },
    stringify(transformArray) {
      const ValidValue = transformArray.reduce((acc, effect) => {
        if (effect.value || effect.value === 0) {
          acc[effect.name] = effect.value
        }
        return acc
      }, {})

      const {
        skewX,
        skewY,
        translateX,
        translateY,
        scaleX = 1,
        scaleY = 1,
        rotate
      } = ValidValue

      const _rotate = rotate && `rotate(${rotate})`
      const skew = this.bindValue(skewX, skewY, 'skew')
      const translate = this.bindValue(translateX, translateY, 'translate')
      const scale =
        scaleX === scaleY && scaleX === 1
          ? ''
          : this.bindValue(scaleX, scaleY, 'scale')

      return [_rotate, skew, translate, scale]
        .filter(x => x)
        .join(' ')
        .trim()
    },
    departTransformToArray() {
      const [rotate] = this.getValue(this.transform, 'rotate')
      const [skewX, skewY] = this.getValue(this.transform, 'skew')
      const [scaleX, scaleY] = this.getValue(this.transform, 'scale')
      const [translateX, translateY] = this.getValue(
        this.transform,
        'translate'
      )

      const map = {
        skewX,
        skewY: skewY || skewX,
        scaleX,
        scaleY: scaleY || scaleX,
        translateX,
        translateY: translateY || translateX
      }

      const transformArray = [
        {
          name: 'rotate',
          max: 360,
          step: 1,
          min: -360,
          units: ['deg'],
          visible: true,
          value: rotate
        }
      ]

      for (const key in map) {
        if (map[key] && map[key] !== '0') {
          const detail = this.options[key]
          detail.value = map[key]
          transformArray.push(cloneJson(detail))
        }
      }

      this.transformArray = transformArray
    },
    getValue(value, key) {
      const regex = new RegExp(`${key}\\(([^(]+)\\)`)
      const match = value.match(regex) || []
      if (match[1]) {
        const [a, b = ''] = match[1].split(',')
        return [a, b]
      }
      else {
        return ['', '']
      }
    },
    humanize,
    bindValue(a = 0, b = 0, attr) {
      if (!a && !b) {
        return ''
      }
      else if (a === b) {
        return `${attr}(${a})`
      }
      else if (attr) {
        return `${attr}(${a},${b})`
      }
    },
    itemRemove(index) {
      deleteBy(this.transformArray, index)
      this.recordStyles({ transform: this.stringify(this.transformArray) })
    },
    add(name) {
      this.transformArray.push({
        name,
        value: this.options[name].default,
        visible: true
      })
      this.recordStyles({ transform: this.stringify(this.transformArray) })
    }
  }
}
</script>

<style scoped lang="scss">
.el-input-number {
  margin-top: 1px;
}
</style>
