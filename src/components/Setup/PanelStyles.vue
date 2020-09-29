<template>
  <el-form
    :disabled="!selectedComponentNodes.length"
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

    <portal-target name="PanelStyles" />

    <item-hidden-controller />

    <dimension />

    <el-divider content-position="left">STACK</el-divider>

    <position />

    <padding />

    <radius />

    <opacity />

    <overflow />

    <portal-target
      name="Rotate"
      slim
    />

    <background-color />

    <border-all />

    <box-shadow />

    <effect />

    <transform />

    <!--      <transitions-->
    <!--        :disabled="!isDefaultState"-->
    <!--        :value="styles.transition"-->
    <!--        @change="recordStyles($event)"-->
    <!--      />-->
  </el-form>
</template>

<script>
// 永遠只會從EditBar裡面用bus.emit('currentSidebar')傳原始 style 過來
import { mapGetters } from 'vuex'
import Radius from './EditorStyle/Radius'
import Padding from './EditorStyle/Padding'
import BackgroundColor from './EditorStyle/BackgroundColor'
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
import { RadioGroup, RadioButton } from 'element-ui'
import Position from '@/components/Setup/EditorStyle/Position'

export default {
  name: 'PanelStyles',
  components: {
    Position,
    BackgroundColor,
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
    ElRadioGroup: RadioGroup,
    ElRadioButton: RadioButton
  },
  data() {
    return {
      state: 'default'
    }
  },
  computed: {
    ...mapGetters('app', ['selectedComponentNodes'])
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
