<template>
  <div>
    <component
      v-for="(type, index) in innerTyped"
      :is="type"
      :value.sync="innerValue[index]"
    />
  </div>
</template>

<script>
import InputStyleUnit from './SelectUnit'
import SelectBorderStyle from './SelectBorderStyle'

export default {
  name: 'InputStyle',
  components: {
    InputStyleUnit,
    SelectBorderStyle
  },
  props: ['value', 'type'],
  data() {
    return {
      innerValue: this.value.split(/[^,]\s/)
    }
  },
  computed: {
    innerTyped() {
      return this.type.reduce((all, type) => {
        const types = {
          color: 'el-color-picker',
          unit: 'input-style-unit',
          'border-style': 'select-border-style'
        }
        all.push(types[type])
        return all
      }, [])
    }
  }
}
</script>
