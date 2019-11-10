<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <p>borderRadius</p>
      <input-style-unit :value.sync="borderRadius" />
    </el-col>
    <el-col :span="12">
      <p>borderTopLeftRadius</p>
      <input-style-unit :value.sync="borderTopLeftRadius" />
    </el-col>

    <el-col :span="12">
      <p>borderTopRightRadius</p>
      <input-style-unit :value.sync="borderTopRightRadius" />
    </el-col>

    <el-col :span="12">
      <p>borderBottomRightRadius</p>
      <input-style-unit :value.sync="borderBottomRightRadius" />
    </el-col>

    <el-col :span="12">
      <p>borderBottomLeftRadius</p>
      <input-style-unit :value.sync="borderBottomLeftRadius" />
    </el-col>

    <login>
      <div>
        <form action="" scope="{ validate, submit }"/>
      </div>
    </login>

    <submit>
      <div>
        <div class2/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
      </div>
    </submit>
  </el-row>
</template>

<script>
import InputStyleUnit from './Components/SelectUnit'
import fourUnitMixin from '../../mixins/styleFourAttrs'
import styleMixin from '../../mixins/style'

const radius = 'borderRadius'

const radiuses = [
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius'
]

export default {
  name: 'Corner',
  components: {
    InputStyleUnit
  },
  mixins: [styleMixin, fourUnitMixin(radius, radiuses)]
}
</script>

<style scoped lang="scss"></style>
