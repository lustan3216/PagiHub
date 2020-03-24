<template>
  <el-tabs
    v-model="currentId"
    closable
    type="border-card"
    @tab-remove="clean"
  >
    <el-tab-pane
      v-for="(border, index) in borders"
      :key="index"
      :label="label[index]"
      :name="border.id"
    >
      <el-form-item label="Width">
        <select-unit :value.sync="border.width" />
      </el-form-item>
      
      <el-form-item label="Style">
        <el-select v-model="border.style" >
          <el-option
            v-for="style in borderStyles"
            :key="style"
            :value="style"
            :label="style.capitalize()"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="Color">
        <el-color-picker v-model="border.color" show-alpha />
      </el-form-item>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import SelectUnit from './Components/SelectUnit'

export default {
  name: 'Border',
  components: {
    SelectUnit
  },
  props: ['computedStyle'],
  data() {
    const tabs = ['border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft']
    
    const borders = tabs.map(name => {
      const attrs = ['width', 'style', 'color']
      const result = { id: name }
  
      attrs.forEach(x => {
        const isNone = this.computedStyle[`${name}Style`] === 'none'
        result[x] = isNone ? undefined : this.computedStyle[name + x.capitalize()]
      })
      return result
    })
    
    return {
      currentId: tabs[0],
      tabs,
      borders,
      borderStyles: ['none', 'dashed', 'dotted', 'solid']
    }
  },
  computed: {
    label() {
      const labels = this.tabs.map(x => x.replace('border', ''))
      labels[0] = 'All'
      return labels
    },
    isAllChange() {
      return this.currentId === this.tabs[0]
    },
    isCurrentBorderValid() {
      const border = this.borders.find(x => x.id === this.currentId)
      return this.isValidBorder(border)
    }
  },
  watch: {
    borders: {
      handler(borders) {
        const styles = {}
  
        borders.forEach((border, index) => {
          let value
          const isAll = !index
          const borderString = this.borderString(border)
          const validString = this.isCurrentBorderValid ? undefined : borderString
          
          if (this.isAllChange) {
            value = isAll ? borderString : validString
          } else {
            value = isAll ? validString : borderString
          }
          
          styles[border.id.kebabCase()] = value
        })
        
        this.$emit('change', styles)
      },
      deep: true
    }
  },
  methods: {
    borderString(border) {
      if (this.isValidBorder(border)) {
        return `${border.width} ${border.style} ${border.color}`
      }
    },
    isValidBorder(border) {
      return Object.values(border).every(x => x)
    },
    clean(name) {
      const border = this.borders.find(x => x.id === name)
      border.width = border.color = border.style = undefined
    }
  }
}
</script>
