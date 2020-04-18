<template>
  <portal-target
    ref="viewPortCover"
    name="Root"
    class="viewport viewPortCover"
  />
</template>

<script>
export default {
  name: 'ViewPortCover',
  props: {
    viewPortEl: {
      type: HTMLDivElement,
      required: true
    }
  },
  mounted() {
    const { $el } = this.$refs.viewPortCover

    this.childListObserver = new MutationObserver(mutations => {
      const hasChild = Array.last(mutations).target.children.length
      $el.classList[hasChild ? 'add' : 'remove']('z1000')
    })

    this.childListObserver.observe($el, {
      childList: true,
      attributes: false,
      characterData: false
    })

    this.styleObserver = new MutationObserver(mutations => {
      const { width, height, transform, webkitTransform } = Array.last(
        mutations
      ).target.style

      Object.assign($el.style, {
        width,
        height,
        transform,
        webkitTransform
      })
    })

    this.styleObserver.observe(this.viewPortEl, {
      attributeOldValue: false,
      characterData: false,
      attributeFilter: ['style']
    })
  },
  beforeDestroy() {
    this.styleObserver.disconnect()
    this.childListObserver.disconnect()
  }
}
</script>

<style scoped lang="scss">
.z1000 {
  z-index: 1000;
}
</style>
