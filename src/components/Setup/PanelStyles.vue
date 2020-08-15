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

    <item-hidden-controller />

    <portal-target
      v-if="canFont"
      name="FontStyles"
      slim
    />

    <el-form >
      <dimension />
    </el-form>

    <el-divider content-position="left">STACK</el-divider>

    <padding :state="state" />

    <radius :state="state" />

    <opacity :state="state" />

    <overflow :state="state" />

    <portal-target
      name="Rotate"
      slim
    />

    <border-all :state="state" />

    <box-shadow :state="state" />

    <effect :state="state" />

    <transform :state="state" />

    <!--      <transitions-->
    <!--        :disabled="!isDefaultState"-->
    <!--        :value="styles.transition"-->
    <!--        @change="assignStyles($event)"-->
    <!--      />-->
  </el-form>
</template>

<script>
// 永遠只會從EditBar裡面用bus.emit('currentSidebar')傳原始 style 過來
import { mapState } from 'vuex'
import { TEXT_EDITOR, GRID, LAYERS, GRID_ITEM } from '@/const'
import Radius from './EditorStyle/Radius'
import Padding from './EditorStyle/Padding'
import Background from './EditorStyle/Background'
import Dimension from './EditorStyle/Dimension'
import Effect from './EditorStyle/Effect'
import Overflow from './EditorStyle/Overflow'
import BoxShadow from './EditorStyle/BoxShadow'
import BorderAll from './EditorStyle/BorderAll'
import Transform from './EditorStyle/Transform'
import TransformOrigin from './EditorStyle/TransformOrigin'
import Opacity from './EditorStyle/Opacity'
import Transitions from './EditorStyle/Transitions'
import ItemHiddenController from './EditorStyle/ItemHiddenController'
import { RadioGroup, RadioButton, Divider } from 'element-ui'

export default {
  name: 'PanelStyles',
  components: {
    Background,
    Padding,
    Radius,
    Opacity,
    BorderAll,
    Dimension,
    Effect,
    Overflow,
    BoxShadow,
    Transitions,
    TransformOrigin,
    Transform,
    ItemHiddenController,
    ElDivider: Divider,
    ElRadioGroup: RadioGroup,
    ElRadioButton: RadioButton
  },
  data() {
    return {
      state: 'default'
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
    isDefaultState() {
      return this.state === 'default'
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
  .el-divider--horizontal {
    margin: 24px 0 14px;
  }
  .el-divider__text {
    font-size: 12px;
    left: -20px;
    button {
      margin-right: 10px;
      padding: 3px !important;
    }
  }
}
</style>
