<template>
  <div
    v-observe-visibility="options"
    class="h-100"
  >
    <slot v-if="vIf" />
  </div>
</template>

<script>
export default {
  name: 'LazyLoad',
  data() {
    return {
      vIf: false,
      options: {
        callback: isVisible => {
          if (isVisible && !this.vIf) {
            this.vIf = true
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
