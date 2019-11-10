<template>
  <span class="wrapper">
    <!--<span class="dimmer-content" />-->
    <slot class="component" />
    <!--<slot v-else />-->
  </span>
</template>

<script>
export default {
  name: 'Wrapper',
  props: {
    dimmer: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  position: relative;
}
.component {
  transition-property: background, opacity;
  transition-duration: 0.6s;
}
.component:hover {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
