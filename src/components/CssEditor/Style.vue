<template>
  <div>
    <div
      v-for="(style, index) in styles"
      class="flex">
      <el-input v-model="style[0]" />
      <el-input
        @input="change(style[0], $event)"
        :disabled="isInvalid(style[0])"
        v-model="style[1]" />
      <el-button @click="remove(index)">-</el-button>
    </div>
    <el-button @click="add">+</el-button>
  </div>
</template>

<script>
import style from '../../mixins/style'

export default {
  name: 'Style',
  mixins: [style],
  data() {
    return {
      styles: Object.entries(this.vm().innerStyles)
    }
  },
  methods: {
    add() {
      this.styles.push(['', ''])
    },
    remove(index) {
      const style = this.styles[index]
      this.assignStyles({ [style[0]]: null })
      this.styles.splice(index, 1)
    },
    isInvalid(key) {
      return !(key in window.getComputedStyle(document.body)) || key.length < 3
    },
    change(style, value) {
      this.assignStyles({ [style]: value })
    }
  }
}
</script>

<style scoped lang="scss"></style>
