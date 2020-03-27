<template>
  <div>
    <el-dropdown class="m-b-10" @command="currentId = $event">
      <span class="el-dropdown-link">
        {{ currentId.capitalize() }}
        <i class="el-icon-arrow-down el-icon--right"/>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="attr in attrs"
          :key="attr"
          :command="attr"
        >
          {{ attr.capitalize() }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  
    <el-row :gutter="5" type="flex">
      <el-col :span="3">
        <el-button
          circle
          size="mini"
          icon="el-icon-delete"
          @click.stop="clean"/>
      </el-col>
      
      <el-col :span="8">
        <el-form-item label="Width">
          <select-unit :value.sync="currentBorder.width" />
        </el-form-item>
      </el-col>
    
      <el-col :span="3">
        <el-form-item label="Color">
          <el-color-picker v-model="currentBorder.color" show-alpha />
        </el-form-item>
      </el-col>
    
      <el-col :span="7">
        <el-form-item label="Style">
          <el-select v-model="currentBorder.style" placeholder="-">
            <el-option
              v-for="style in borderStyles"
              :key="style"
              :value="style"
              :label="style.capitalize()"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SelectUnit from '../Components/SelectUnit'

export default {
  name: 'Border',
  components: {
    SelectUnit
  },
  props: ['computedStyle'],
  data() {
    const attrs = ['border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft']
    
    const borders = attrs.map(name => {
      const attrs = ['width', 'style', 'color']
      const result = { id: name }
  
      attrs.forEach(x => {
        const isNone = this.computedStyle[`${name}Style`] === 'none'
        result[x] = isNone ? undefined : this.computedStyle[name + x.capitalize()]
      })
      return result
    })
    
    return {
      currentId: attrs[0],
      attrs,
      borders,
      borderStyles: ['none', 'dashed', 'dotted', 'solid']
    }
  },
  computed: {
    currentBorder() {
      return this.borders.find(x => x.id === this.currentId)
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
