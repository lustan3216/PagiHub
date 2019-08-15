<template>
  <div
    class="wrapper"
    @mouseover="isHover = true"
    @mouseleave="isHover = false">
    <div
      v-show="isHover"
      class="functions">
      <span
        class="icon"
        @click="copy">+</span>

      <span
        class="icon"
        @click="remove">X</span>

      <span
        class="icon"
        @click="settings">O</span>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Wrapper',
  data() {
    return {
      isHover: false
    }
  },
  computed: {
    parent() {
      return this.$parent.observableNode || this.$observable.content
    },
    index() {
      return parent.indexOf(this.observableNode)
    }
  },
  methods: {
    copy() {
      this.parent.splice(this.index, 0, this.observableNode)
    },
    remove() {
      this.parent.splice(this.index, 1)
    },
    settings() {
      this.$observable.nodeForSetting = this.$children[0]
    }
  }
}
</script>

<style scoped>
.icon {
  margin: 5px;
}
.wrapper {
  position: relative;
  padding: 20px;
}
.functions {
  top: 0;
  left: 0;
  position: absolute;
}
</style>
