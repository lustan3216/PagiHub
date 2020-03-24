<template>
  <el-tabs
    v-model="currentId"
    :closable="Boolean(boxShadows.length - 1)"
    addable
    type="border-card"
    @edit="handleTabsEdit"
  >
    <el-tab-pane
      v-for="(boxShadow, index) in boxShadows"
      :key="boxShadow.id"
      :label="`${index + 1}`"
      :name="boxShadow.id"
    >
      <el-form-item label="">
        <el-switch
          v-model="boxShadow.inset"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="Outline"
          inactive-text="Inset"/>
      </el-form-item>
      
      <el-form-item label="Horizontal">
        <select-unit :value.sync="boxShadow.offsetX" :exclude="['%']"/>
      </el-form-item>
      
      <el-form-item label="Vertical">
        <select-unit :value.sync="boxShadow.offsetY" :exclude="['%']"/>
      </el-form-item>
      
      <el-form-item label="Blur">
        <select-unit :value.sync="boxShadow.blurRadius" :exclude="['%']"/>
      </el-form-item>
      
      <el-form-item label="Spread">
        <select-unit :value.sync="boxShadow.spreadRadius" :exclude="['%']"/>
      </el-form-item>
      
      <el-form-item label="Color">
        <el-color-picker v-model="boxShadow.color" show-alpha />
      </el-form-item>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { parse, stringify } from '../../utils/boxShadow'
import csso from 'csso'
import SelectUnit from './Components/SelectUnit'
window.parse = parse
export default {
  name: 'BoxShadows',
  components: {
    SelectUnit
  },
  props: ['computedStyle'],
  data() {
    const boxShadows = parse(this.computedStyle.boxShadow)
    
    boxShadows.forEach((boxShadow, index) => {
      boxShadow.id = (+new Date() + index).toString()
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
