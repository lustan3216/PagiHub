<template>
  <el-tabs
    v-model="currentId"
    closable
    addable
    type="border-card"
    class="no-shadow"
    @edit="handleTabsEdit"
  >
    <el-tab-pane
      v-for="(boxShadow, index) in boxShadows"
      :key="boxShadow.id"
      :label="`${index + 1}`"
      :name="boxShadow.id"
    >
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item>
            <el-select v-model="boxShadow.inset" placeholder="Outline">
              <el-option value="Outline"/>
              <el-option value="Inset"/>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="X">
            <select-unit :value.sync="boxShadow.offsetX" :exclude="['%']"/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="Y">
            <select-unit :value.sync="boxShadow.offsetY" :exclude="['%']"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="Blur">
            <select-unit :value.sync="boxShadow.blurRadius" :exclude="['%']"/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="Spread">
            <select-unit :value.sync="boxShadow.spreadRadius" :exclude="['%']"/>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item label="Color">
            <el-color-picker v-model="boxShadow.color" show-alpha />
          </el-form-item>
        </el-col>
      </el-row>

    </el-tab-pane>
  </el-tabs>
</template>

<script>
import csso from 'csso'
import SelectUnit from '../Components/SelectUnit'
import { parse, stringify } from '../../utils/boxShadow'

export default {
  name: 'BoxShadows',
  components: {
    SelectUnit
  },
  props: {
    computedStyle: {
      type: Object,
      required: true
    }
  },
  data() {
    const boxShadows = parse(this.computedStyle.boxShadow)

    boxShadows.forEach((boxShadow, index) => {
      boxShadow.id = (+new Date() + index).toString()
      boxShadow.inset = boxShadow.inset ? 'Inset' : 'Outline'
    })

    return {
      currentId: boxShadows[0].id,
      boxShadows
    }
  },
  watch: {
    boxShadows: {
      handler(value) {
        const key = 'box-shadow:'
        const css = csso.minifyBlock(key + stringify(value)).css
        this.$emit('change', { boxShadow: css.split(key)[1] })
      },
      deep: true
    }
  },
  methods: {
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        this.boxShadows.push({
          id: (+new Date()).toString(),
          inset: null,
          offsetX: null,
          offsetY: null,
          blurRadius: null,
          spreadRadius: null,
          color: 'none'
        })

        this.currentId = Array.last(this.boxShadows).id
      } else {
        const index = this.boxShadows.findIndex(x => x.id === targetName)
        this.boxShadows.splice(index, 1)

        if (this.currentId === targetName) {
          this.currentId = Array.first(this.boxShadows).id
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  ::v-deep {
    .el-tabs__content {
      overflow: initial;
      padding: 10px 10px 0;
    }
    .el-collapse-item__wrap{
      border-bottom: none;
    }
  }
</style>
