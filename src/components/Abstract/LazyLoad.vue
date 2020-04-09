<template>
  <div
    v-observe-visibility="options"
    class="h-100"
  >
    <div
      v-show="vShow"
      class="h-100"
    >
      <slot v-if="isDraftMode" />
      <slot v-else-if="vIf" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LazyLoad',
  data() {
    return {
      vShow: false,
      vIf: false,
      options: {
        callback: isVisible => {
          if (isVisible && !this.vIf) {
            this.vIf = true
            this.vShow = true
          } else {
            this.vShow = isVisible
          }
        },
        intersection: {
          rootMargin: '10px'
        }
      }
    }
  }
}
</script>
