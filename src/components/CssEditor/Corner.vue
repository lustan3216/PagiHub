<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <p>borderRadius</p>
      <select-px :value.sync="borderRadius" />
    </el-col>
    <el-col :span="12">
      <p>borderTopLeftRadius</p>
      <select-px :value.sync="borderTopLeftRadius" />
    </el-col>

    <el-col :span="12">
      <p>borderTopRightRadius</p>
      <select-px :value.sync="borderTopRightRadius" />
    </el-col>

    <el-col :span="12">
      <p>borderBottomRightRadius</p>
      <select-px :value.sync="borderBottomRightRadius" />
    </el-col>

    <el-col :span="12">
      <p>borderBottomLeftRadius</p>
      <select-px :value.sync="borderBottomLeftRadius" />
    </el-col>
  </el-row>
</template>

<script>
import SelectPx from './Components/SelectPx'
import fourUnitMixin from '../../mixins/styleFourAttrs'
import styleMixin from '../../mixins/style'

const radius = 'borderRadius'

const radiuses = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius']

export default {
  name: 'Corner',
  components: {
    SelectPx
  },
  mixins: [styleMixin, fourUnitMixin(radius, radiuses)]
}
</script>

<style scoped lang="scss"></style>
