<template>
  <el-form
    :disabled="!selectedComponentIds.length"
    label-position="top"
  >
    <!--    <div class="m-b-10">-->
    <!--      <span class="title p-r-10">State</span>-->
    <!--      <el-radio-group-->
    <!--        v-model="state"-->
    <!--        size="mini"-->
    <!--      >-->
    <!--        <el-radio-button label="default">-->
    <!--          Default-->
    <!--        </el-radio-button>-->

    <!--        <el-radio-button label=":hover">-->
    <!--          Hover-->
    <!--        </el-radio-button>-->

    <!--        <el-radio-button label=":active">-->
    <!--          Click-->
    <!--        </el-radio-button>-->

    <!--        &lt;!&ndash;        <el-radio-button label="show">&ndash;&gt;-->
    <!--        &lt;!&ndash;          Show&ndash;&gt;-->
    <!--        &lt;!&ndash;        </el-radio-button>&ndash;&gt;-->
    <!--      </el-radio-group>-->
    <!--    </div>-->

    <div :key="state + selectedComponentIds.join()">
      <item-hidden-controller />

      <portal-target
        v-if="canFont"
        name="FontStyles"
        slim
      />

      <dimension v-if="canDimension"/>
      <!--width / height 要再考慮，且可以用grid item做, grid item的margin 要搬來style-->

      <el-divider content-position="left">STACK</el-divider>
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
      <opacity
        :value="styles.opacity"
        @change="assignStyles($event)"
      />
      <rotate
        :value="styles.transform"
        @change="assignStyles($event)"
      />
      <overflow
        v-if="canOverflow"
        :value="styles.overflow"
        @change="assignStyles($event)"
      />

      <border-all
        v-if="canBorder"
        :value="{
          border: styles.border,
          borderTop: styles.borderTop,
          borderRight: styles.borderRight,
          borderBottom: styles.borderBottom,
          borderLeft: styles.borderLeft,
        }"
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
      <!--      <transitions-->
      <!--        :disabled="!isDefaultState"-->
      <!--        :value="styles.transition"-->
      <!--        @change="assignStyles($event)"-->
      <!--      />-->
    </div>
  </el-form>
</template>

<script>
// 永遠只會從EditBar裡面用bus.emit('currentSidebar')傳原始 style 過來
import { GRID, GRID_ITEM, LAYERS, STYLE, TEXT_EDITOR } from '@/const'
import { mapMutations, mapState } from 'vuex'
import Radius from './EditorStyle/Radius'
import Padding from './EditorStyle/Padding'
import Background from './EditorStyle/Background'
import Dimension from './EditorStyle/Dimension'
import Effect from './EditorStyle/Effect'
import Overflow from './EditorStyle/Overflow'
import BoxShadow from './EditorStyle/BoxShadow'
import BorderAll from './EditorStyle/BorderAll'
import Transform from './EditorStyle/Transform'
import Rotate from './EditorStyle/Rotate'
import Opacity from './EditorStyle/Opacity'
import Transitions from './EditorStyle/Transitions'
import ItemHiddenController from './EditorStyle/ItemHiddenController'
import { RadioGroup, RadioButton, Divider } from 'element-ui'
import { getValueByPath } from '@/utils/tool'

export default {
  name: 'PanelStyles',
  components: {
    Background,
    Padding,
    Radius,
    Rotate,
    Opacity,
    BorderAll,
    Dimension,
    Effect,
    Overflow,
    BoxShadow,
    Transitions,
    Transform,
    ItemHiddenController,
    ElDivider: Divider,
    ElRadioGroup: RadioGroup,
    ElRadioButton: RadioButton
  },
  data() {
    return {
      state: 'default',
      styles: {
        opacity: '1',
        // width: '',
        minWidth: '',
        maxWidth: '',
        // height: '',
        minHeight: '',
        maxHeight: '',
        boxShadow: '',
        filter: '',
        border: '',
        borderRadius: '',
        // margin: '',
        padding: '',
        overflow: '',
        transformOrigin: '',
        transition: '',
        transform: ''
      }
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    nodes() {
      return this.selectedComponentIds.map(id => this.componentsMap[id])
    },
    canFont() {
      return this.nodes.every(node => [TEXT_EDITOR].includes(node.tag))
    },
    canRadius() {
      return this.nodes.every(node => ![GRID, LAYERS].includes(node.tag))
    },
    canBorder() {
      return this.nodes.every(node => ![GRID, LAYERS].includes(node.tag))
    },
    canOverflow() {
      return this.nodes.every(node => [GRID_ITEM].includes(node.tag))
    },
    canPadding() {
      return this.nodes.every(node => [GRID_ITEM].includes(node.tag))
    },
    canDimension() {
      return this.nodes.every(node => [GRID_ITEM].includes(node.tag))
    },
    isDefaultState() {
      return this.state === 'default'
    }
  },
  watch: {
    state() {
      this.calcStyles()
    },
    selectedComponentIds() {
      this.calcStyles()
    }
  },
  created() {
    this.calcStyles()
  },
  methods: {
    ...mapMutations('component', ['RECORD']),
    calcStyles() {
      if (!this.selectedComponentIds.length) {
        return
      }

      // 大多從getComputedStyle裡面拿到的跟實際存的會不一樣，所以都直接從style拿就好
      // 譬如 transform ComputedStyle 裡面拿到的是matrix, 這樣js無法轉換成rotate等等
      // borer是因為color, ComputedStyle拿出來的都是rgba, 但使用者存的不一定是rgba
      // 可能button, formItem 原本就有style，從computedStyle比較好?
      // 可能直接把有border的元素，都直接拿掉自己寫

      if (this.selectedComponentIds.length === 1) {
        // const id = this.selectedComponentIds[0]

        for (const attr in this.styles) {
          this.styles[attr] = getValueByPath(this.nodes[0], [STYLE, this.state, attr], '')

          // if (this.styles[attr]) {
          //     return
          // }
          //
          // if (attr === 'width') {
          //   this.styles[attr] = this.vmMap[id].$el.offsetWidth
          // }
          // if (attr === 'height') {
          //   this.styles[attr] = this.vmMap[id].$el.offsetHeight
          // }
        }

        // this.styles.transformOrigin = this.parseOrigin(this.styles) || ''
      }

      // let attrs = ['transform']

      // 只有default的style可以從getComputedStyle拿到，其他click, hover是自己創造的所以直接從props上拿
      // 這裡忘了為什麼
      // if (this.isDefaultState) {
      //   attrs = [...attrs, ...computedAttrs]
      // }
    },
    assignStyles(object) {
      const records = []

      for (const key in object) {
        let value = object[key]

        this.styles[key] = value || ''

        if (value === '' || value === undefined || value === null) {
          value = undefined
        }

        this.selectedComponentIds.forEach(id => {
          records.push({
            path: `${id}.${STYLE}.${this.state}.${key}`,
            value
          })
        })
      }

      if (records.length) {
        this.RECORD(records)
      }
    },
    parseOrigin({ width, height, transformOrigin }) {
      if (!this.isDefaultState) {
        return transformOrigin
      }

      const [x, y] = transformOrigin.split(' ')

      const _x = (parseInt(x) / parseInt(width)) || 0
      const _y = (parseInt(y) / parseInt(height)) || 0
      return `${_x.toFixed(2) * 100}% ${_y.toFixed(2) * 100}%`
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
    padding-bottom: 10px;
  }
  .el-form-item {
    text-align: center;
  }
  .el-divider--horizontal{
    margin: 24px 0 14px;
  }
  .el-divider__text{
    font-size: 12px;
    left: -20px;
    button {
      margin-right: 10px;
      padding: 3px !important;
    }
  }
}
</style>
