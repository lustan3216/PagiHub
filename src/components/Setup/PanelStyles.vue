<template>
  <el-form
    v-if="theOnlySelectedComponentId"
    :key="theOnlySelectedComponentId"
    label-position="top"
  >
    <node-info
      :id="theOnlySelectedComponentId"
      class="text-center m-b-10 block"
      show-family
    />

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

        <el-radio-button label="hover">
          Hover
        </el-radio-button>

        <el-radio-button label="click">
          Click
        </el-radio-button>

        <el-radio-button label="visible">
          Visible
        </el-radio-button>
      </el-radio-group>
    </div>

    <padding
      :value="styles.padding || '0'"
      @input="assignStyles('padding', $event)"
    />
    <radius
      :value="styles.borderRadius"
      @input="assignStyles('borderRadius', $event)"
    />
    <border-width
      :value="styles.borderWidth"
      @input="assignStyles('borderWidth', $event)"
    />
    <border-style
      :value="styles.borderStyle"
      @input="assignStyles('borderStyle', $event)"
    />
    <border-color
      :value="styles.borderColor"
      @input="assignStyles('borderColor', $event)"
    />
    <overflow
      :value="styles.overflow"
      class="m-b-10"
      @input="assignStyles('overflow', $event)"
    />
    <box-shadow
      :value="styles.boxShadow"
      @input="assignStyles('boxShadow', $event)"
    />

    <effect
      :value.sync="styles.filter"
      :opacity.sync="styles.opacity"
      @input="assignStyles('filter', $event)"
    />
    <transform
      :value.sync="styles.transform"
      :origin.sync="styles.transformOrigin"
      @input="assignStyles('opacity', $event)"
    />

    <!-- avoid transition to VUE's transition-->
    <transitions
      :value="styles.transition"
      @input="assignStyles('transformOrigin', $event)"
    />

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
import NodeInfo from '@/components/TemplateUtils/NodeInfo'
import { RadioGroup, RadioButton, Divider } from 'element-ui'
import { getComputedStyle } from '@/utils/vmMap'

const attributes = [
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
  'borderColor',
  'borderStyle',
  'margin',
  'padding',
  'opacity',
  'overflow',
  'transform',
  'transformOrigin',
  'transition'
]

export default {
  name: 'PanelStyles',
  components: {
    NodeInfo,
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
  data() {
    const id = this.$store.getters['app/theOnlySelectedComponentId']
    const computedStyle = getComputedStyle(id)

    const styles = attributes.reduce((all, attr) => {
      all[attr] = computedStyle[attr]
      return all
    }, {})

    styles.transformOrigin = this.parseOrigin(styles)

    return {
      klass: '',
      activeNames: '',
      state: 'default',
      styles
    }
  },
  computed: {
    ...mapGetters('app', ['theOnlySelectedComponentId'])
  },
  methods: {
    ...mapMutations('draft', ['RECORD']),
    assignStyles(attr, value) {
      this.styles[attr] = value
      this.RECORD([
        {
          path: `${this.theOnlySelectedComponentId}.${STYLE}.${this.state}.${attr}`,
          value
        }
      ])
    },
    parseOrigin({ width, height, transformOrigin }) {
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
    padding-bottom: 3px !important;
    font-size: 12px;
    padding-right: 3px;
    color: #606266;
  }
}
</style>
