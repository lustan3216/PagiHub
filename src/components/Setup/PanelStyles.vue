<template>
  <el-form label-position="top">
    <portal-target
      name="PanelStyles"
      slim
    />

    <div class="m-b-10">
      <span class="title p-r-10">State</span>
      <el-radio-group
        v-model="state"
        size="mini"
      >
        <el-radio-button label="default">
          Default
        </el-radio-button>

        <el-radio-button label=":hover">
          Hover
        </el-radio-button>

        <el-radio-button label=":active">
          Click
        </el-radio-button>

        <!--        <el-radio-button label="show">-->
        <!--          Show-->
        <!--        </el-radio-button>-->
      </el-radio-group>
    </div>

    <div :key="id + state">
      <padding
        v-if="canPadding"
        :value="styles.padding"
        @change="assignStyles($event)"
      />
      <radius
        v-if="canRadius"
        :value="styles.borderRadius"
        @change="assignStyles($event)"
      />
      <border-width
        v-if="canBorderWidth"
        :value="styles.borderWidth"
        @change="assignStyles($event)"
      />
      <border-style
        v-if="canBorderStyle"
        :value="styles.borderStyle"
        @change="assignStyles($event)"
      />
      <border-color
        v-if="canBorderColor"
        :value="styles.borderColor"
        @change="assignStyles($event)"
      />
      <overflow
        v-if="canOverflow"
        :value="styles.overflow"
        class="m-b-10"
        @change="assignStyles($event)"
      />
      <box-shadow
        :value="styles.boxShadow"
        @change="assignStyles($event)"
      />
      <effect
        :value="styles.filter"
        :opacity="styles.opacity"
        @change="assignStyles($event)"
      />
      <transform
        :value="styles.transform"
        :origin="styles.transformOrigin"
        @change="assignStyles($event)"
      />
      <transitions
        v-if="isDefaultState"
        :value="styles.transition"
        @change="assignStyles($event)"
      />
    </div>

    <!--    <dimension-->
    <!--      :computed-style="computedStyle"-->
    <!--          @change="assignStyles"-transformOrigin-->
    <!--width / height 要再考慮，且可以用grid item做, grid item的margin 要搬來style-->
  </el-form>
</template>

<script>
// 永遠只會從EditBar裡面用bus.emit('currentSidebar')傳原始 style 過來
import { STYLE } from '@/const'
import { mapMutations, mapGetters } from 'vuex'
import Radius from './EditorStyle/Radius'
import Padding from './EditorStyle/Padding'
import Dimension from './EditorStyle/Dimension'
import Effect from './EditorStyle/Effect'
import Overflow from './EditorStyle/Overflow'
import BoxShadow from './EditorStyle/BoxShadow'
import BorderColor from './EditorStyle/BorderColor'
import BorderWidth from './EditorStyle/BorderWidth'
import BorderStyle from './EditorStyle/BorderStyle'
import Transform from './EditorStyle/Transform'
import Transitions from './EditorStyle/Transitions'
import { RadioGroup, RadioButton, Divider } from 'element-ui'
import { getComputedStyle } from '@/utils/vmMap'
import { getValueByPath } from '@/utils/tool'

const computedAttrs = [
  'width',
  'minWidth',
  'maxWidth',
  'height',
  'minHeight',
  'maxHeight',
  'boxShadow',
  'filter',
  'borderRadius',
  'borderWidth',
  'borderStyle',
  'margin',
  'padding',
  'overflow',
  'transformOrigin',
  'transition'
]

const savedAttrs = ['borderColor', 'transform']

export default {
  name: 'PanelStyles',
  components: {
    Radius,
    Padding,
    BorderColor,
    BorderWidth,
    BorderStyle,
    Dimension,
    Effect,
    Overflow,
    BoxShadow,
    Transitions,
    Transform,
    ElDivider: Divider,
    ElRadioGroup: RadioGroup,
    ElRadioButton: RadioButton
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      state: 'default',
      styles: {}
    }
  },
  computed: {
    ...mapGetters('app', [
      'selectedComponentNode',
      'theOnlySelectedComponentId'
    ]),
    canRadius() {
      return !['grid-generator'].includes(this.nodeTag)
    },
    canPadding() {
      return !['grid-generator'].includes(this.nodeTag)
    },
    canBorderColor() {
      return !['grid-generator'].includes(this.nodeTag)
    },
    canBorderWidth() {
      return !['grid-generator'].includes(this.nodeTag)
    },
    canBorderStyle() {
      return !['grid-generator'].includes(this.nodeTag)
    },
    canDimension() {
      return [''].includes(this.nodeTag)
    },
    canOverflow() {
      return ['grid-item'].includes(this.nodeTag)
    },
    isDefaultState() {
      return this.state === 'default'
    },
    node() {
      return this.selectedComponentNode
    },
    nodeTag() {
      return this.node.tag
    }
  },
  watch: {
    theOnlySelectedComponentId() {
      this.calcStyles()
    },
    state() {
      this.calcStyles()
    }
  },
  created() {
    this.calcStyles()
  },
  methods: {
    ...mapMutations('draft', ['RECORD']),
    calcStyles() {
      const styles = {}

      if (this.isDefaultState) {
        computedAttrs.reduce((all, attr) => {
          all[attr] = getComputedStyle(this.id)[attr]
          return all
        }, styles)
      }

      const attrs = this.isDefaultState
        ? savedAttrs
        : [...computedAttrs, ...savedAttrs]

      attrs.reduce((all, attr) => {
        all[attr] = getValueByPath(this.node, [STYLE, this.state, attr], '')
        return all
      }, styles)

      styles.transformOrigin = this.parseOrigin(styles) || ''

      this.styles = styles
    },
    assignStyles(object) {
      // Object.assign(this.styles, object)
      const records = []

      for (const key in object) {
        let value = object[key]

        this.styles[key] = value || ''

        if (value === '' || value === undefined || value === null) {
          value = undefined
        }

        records.push({
          path: `${this.id}.${STYLE}.${this.state}.${key}`,
          value
        })
      }

      this.RECORD(records)
    },
    parseOrigin({ width, height, transformOrigin }) {
      if (!this.isDefaultState) {
        return transformOrigin
      }

      const [x, y] = transformOrigin.split(' ')
      const _x = (parseInt(x) / parseInt(width)).toFixed(2) * 100
      const _y = (parseInt(y) / parseInt(height)).toFixed(2) * 100
      return `${_x}% ${_y}%`
    }
  }
}
</script>

<style scoped lang="scss">
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: inherit;
}
::v-deep .el-select * {
  vertical-align: initial;
}
::v-deep {
  .el-col {
    text-align: center;
    padding-bottom: 10px;
  }
  .el-form-item {
    text-align: center;
  }
  .title {
    display: inline-block;
    position: relative;
    color: #606266;
    font-size: 12px;
  }

  .sub-title {
    padding-bottom: 0 !important;
    font-size: 12px;
    padding-right: 3px;
    color: #606266;
  }
}
</style>
