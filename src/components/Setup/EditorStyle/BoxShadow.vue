<template>
  <div>
    <span class="title p-r-10">Box Shadow</span>

    <el-button
      type="text"
      icon="el-icon-circle-plus-outline"
      @click="values.push({ id: +new Date() })"
    />

    <el-row
      v-if="values.length"
      :gutter="2"
    >
      <el-col
        :offset="6"
        :span="3"
        class="sub-title"
      >
        X
      </el-col>
      <el-col
        :span="3"
        class="sub-title"
      >
        Y
      </el-col>
      <el-col
        :span="3"
        class="sub-title"
      >
        Blur
      </el-col>
      <el-col
        :span="3"
        class="sub-title"
      >
        Spread
      </el-col>
    </el-row>

    <el-row
      v-for="(boxShadow, index) in values"
      :key="boxShadow.id"
      :gutter="2"
      class="flex inputs"
    >
      <el-col :span="2">
        <el-button
          type="text"
          icon="el-icon-remove-outline"
          @click="values.splice(index, 1)"
        />
      </el-col>

      <el-col :span="4">
        <el-button
          :type="boxShadow.inset ? 'primary' : ''"
          class="w-100"
          type="number"
          @click="boxShadow.inset = !boxShadow.inset"
        >
          Inset
        </el-button>
      </el-col>

      <el-col :span="3">
        <el-input
          v-model.number="boxShadow.offsetX"
          type="number"
        />
      </el-col>

      <el-col :span="3">
        <el-input
          v-model.number="boxShadow.offsetY"
          type="number"
        />
      </el-col>

      <el-col :span="3">
        <el-input
          v-model.number="boxShadow.blurRadius"
          type="number"
        />
      </el-col>
      <el-col :span="3">
        <el-input
          v-model.number="boxShadow.spreadRadius"
          type="number"
        />
      </el-col>
      <el-col :span="3">
        <el-color-picker
          :value="boxShadow.color === 'none' ? null : boxShadow.color"
          show-alpha
          @input="boxShadow.color = $event"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SelectUnit from '@/components/Components/SelectUnit'
import {
  parse,
  stringify
} from '@/components/Setup/EditorStyle/utils/boxShadow'

export default {
  name: 'BoxShadows',
  components: {
    SelectUnit
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    const values = this.value === 'none' ? [] : parse(this.value)

    const id = +new Date()
    values.forEach((boxShadow, index) => {
      boxShadow.id = id + index
    })

    return {
      values
    }
  },
  watch: {
    values: {
      handler(values) {
        values.filter(x => x.color && (x.spreadRadius || x.blurRadius))
        this.$emit('update:value', stringify(values))
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.inputs {
  .el-input .el-input__inner {
    padding: 0 5px;
  }
  .el-button {
    padding: 7px 5px;
  }
}
</style>
